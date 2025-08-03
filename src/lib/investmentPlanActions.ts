"use server";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { supabase } from "./supabaseClient";
import nodemailer from "nodemailer";


// Types
export interface UserInvestment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  expectedReturn: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  nextPayoutDate?: string;
  totalPayouts: number;
  planTitle?: string;
  planPercentage?: number;
}

export interface InvestmentPlan {
  id: string;
  title: string;
  percentage: number;
  duration_days: number;
  min_amount: number;
  max_amount: number;
  interval_days: number;
}

// Helper function to authenticate user via cookies
async function authenticateUser(): Promise<{ userId: string | null; error?: string }> {
  console.log('Authenticating user...');
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    console.log('Retrieved userId from cookies:', userId);
    
    if (!userId) {
      console.log('No userId found in cookies - user not authenticated');
      return { userId: null, error: 'Not authenticated' };
    }
    
    return { userId };
  } catch (err) {
    console.error('Authentication error:', err);
    return { userId: null, error: 'Authentication failed' };
  }
}

// Create a new investment
export async function createInvestment(
  planId: string,
  amount: number
): Promise<{ success?: boolean; error?: string; investment?: UserInvestment }> {
  console.log('Creating new investment for plan:', planId, 'with amount:', amount);
  try {
    const { userId, error: authError } = await authenticateUser();
    console.log('Authentication result:', { userId, authError });
    
    if (authError || !userId) {
      console.log('Authentication failed, redirecting to signin');
      redirect('/signin');
      return { error: authError || 'Not authenticated' };
    }

    // Fetch investment plan
    console.log('Fetching investment plan:', planId);
    const { data: plan, error: planError } = await supabase
      .from('tradeinvestment_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      console.log('Error fetching plan:', planError);
      return { error: 'Invalid investment plan' };
    }

    const { min_amount, max_amount, percentage, duration_days, interval_days, title } = plan;
    console.log('Retrieved plan details:', { min_amount, max_amount, percentage, duration_days, interval_days, title });

    // Validate amount range
    if (amount < min_amount || amount > max_amount) {
      console.log('Invalid amount:', amount, 'not between', min_amount, 'and', max_amount);
      return { error: `Amount must be between $${min_amount} and $${max_amount} for this plan` };
    }

    // Check user balance and get user details for email
    console.log('Checking user balance for userId:', userId);
    const { data: user, error: userError } = await supabase
      .from('tradingprofile')
      .select('balance, email, first_name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.log('Error fetching user balance:', userError);
      return { error: 'Failed to fetch user balance' };
    }

    console.log('User balance:', user.balance);
    if (user.balance < amount) {
      console.log('Insufficient balance:', user.balance, '<', amount);
      return { error: 'Insufficient balance' };
    }

    // Calculate investment details
    console.log('Calculating investment details...');
    const currentDate = new Date();
    const payoutCount = Math.floor(duration_days / interval_days);
    const expectedReturn = amount * (percentage / 100) * payoutCount;
    console.log('Calculated expectedReturn:', expectedReturn);

    const calculateFutureDate = (daysToAdd: number) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + daysToAdd);
      return date;
    };

    const endDate = calculateFutureDate(duration_days);
    const nextPayoutDate = calculateFutureDate(interval_days);
    console.log('Calculated dates:', { endDate, nextPayoutDate });

    // Deduct amount from user balance
    console.log('Deducting amount from user balance...');
    const { error: balanceUpdateError } = await supabase
      .from('tradingprofile')
      .update({ balance: user.balance - amount })
      .eq('id', userId);

    if (balanceUpdateError) {
      console.log('Error updating balance:', balanceUpdateError);
      return { error: 'Failed to process investment' };
    }

    // Create investment record
    console.log('Creating investment record...');
    const { data: investment, error: investmentError } = await supabase
      .from('tradeuser_investments')
      .insert({
        user_id: userId,
        plan_id: planId,
        amount,
        expected_return: expectedReturn,
        start_date: currentDate.toISOString(),
        end_date: endDate.toISOString(),
        next_payout_date: nextPayoutDate.toISOString(),
        status: 'active'
      })
      .select(`
        id,
        user_id,
        plan_id,
        amount,
        expected_return,
        start_date,
        end_date,
        status,
        next_payout_date,
        total_payouts
      `)
      .single();

    if (investmentError) {
      console.log('Error creating investment:', investmentError);
      // Rollback balance deduction
      console.log('Rolling back balance deduction...');
      await supabase
        .from('tradingprofile')
        .update({ balance: user.balance })
        .eq('id', userId);
      
      return { error: 'Failed to create investment' };
    }

    // Send investment confirmation email
    console.log('Preparing to send investment confirmation email...');
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `TTradeCapital Investments <${process.env.EMAIL_USERNAME}>`,
        to: user.email,
        subject: `Investment Confirmation - ${title} Plan`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; background-image: url('https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181342/photo-1563986768711-b3bde3dc821e_o5hj2v.avif'); background-size: cover; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <div style="background-color: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 8px;">
              <img src="https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181473/ima_m8am4h.jpg" alt="TTradeCapital Logo" style="max-width: 200px; margin-bottom: 20px;">
              
              <h2 style="color: #2ecc71; margin-top: 0; font-weight: 600;">Investment Successfully Created</h2>
              
              <p style="line-height: 1.6;">Dear ${user.first_name || 'Valued Investor'},</p>
              
              <p style="line-height: 1.6;">We're pleased to confirm your new investment in our <strong>${title}</strong> plan has been successfully activated. Your funds are now working for you.</p>
              
              <div style="background-color: rgba(46, 204, 113, 0.1); padding: 20px; border-left: 4px solid #2ecc71; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 8px 0; font-weight: 500;">Investment Amount: <span style="color: #2ecc71;">$${amount.toFixed(2)}</span></p>
                <p style="margin: 8px 0; font-weight: 500;">Plan: <span style="color: #2ecc71;">${title} (${percentage}% return)</span></p>
                <p style="margin: 8px 0; font-weight: 500;">Investment ID: <span style="color: #2ecc71;">${investment.id}</span></p>
                <p style="margin: 8px 0; font-weight: 500;">Start Date: <span style="color: #2ecc71;">${currentDate.toLocaleDateString()}</span></p>
                <p style="margin: 8px 0; font-weight: 500;">End Date: <span style="color: #2ecc71;">${endDate.toLocaleDateString()}</span></p>
                <p style="margin: 8px 0; font-weight: 500;">Next Payout: <span style="color: #2ecc71;">${nextPayoutDate.toLocaleDateString()}</span></p>
                <p style="margin: 8px 0; font-weight: 500;">Expected Return: <span style="color: #2ecc71;">$${expectedReturn.toFixed(2)}</span></p>
              </div>
              
              <p style="line-height: 1.6;"><strong>Investment Details:</strong></p>
              <ul style="line-height: 1.6; padding-left: 20px;">
                <li>Payouts every ${interval_days} days</li>
                <li>Total duration: ${duration_days} days</li>
                <li>Estimated ${payoutCount} payout(s) during term</li>
              </ul>
              
              <div style="background-color: rgba(41, 128, 185, 0.1); padding: 15px; border-left: 4px solid #2980b9; border-radius: 4px; margin: 20px 0;">
                <p style="line-height: 1.6; margin: 0; font-weight: 500; color: #2980b9;">Next Steps:</p>
                <p style="line-height: 1.6; margin: 8px 0 0 0;">Monitor your investment performance in your dashboard. You'll receive email notifications for each payout.</p>
              </div>
              
             
              
              <div style="margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <p style="margin: 5px 0;">Best regards,</p>
                <p style="margin: 5px 0; font-weight: 600;">TTradeCapital Investments Team</p>
                <p style="margin: 5px 0; font-size: 12px; color: rgba(255,255,255,0.6);">Wealth Management Division</p>
              </div>
              
              <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 30px; line-height: 1.5;">
                <strong>Note:</strong> Investment returns are estimates based on current rates and are not guaranteed. 
                Past performance is not indicative of future results. This is an automated message - please do not reply directly.
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Investment confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send investment confirmation email:', emailError);
      // Continue even if email fails
    }

    console.log('Investment created successfully:', investment);
    return {
      success: true,
      investment: {
        id: investment.id,
        userId: investment.user_id,
        planId: investment.plan_id,
        amount: investment.amount,
        expectedReturn: investment.expected_return,
        startDate: investment.start_date,
        endDate: investment.end_date,
        status: investment.status as 'active' | 'completed' | 'cancelled',
        nextPayoutDate: investment.next_payout_date,
        totalPayouts: investment.total_payouts || 0,
        planTitle: title,
        planPercentage: percentage
      }
    };
  } catch (err) {
    console.error('Unexpected error in createInvestment:', err);
    return { error: 'An unexpected error occurred' };
  }
}

// Get user investments
export async function getUserInvestments(): Promise<{ data?: UserInvestment[]; error?: string }> {
    console.log('Getting user investments...');
    try {
      const { userId, error: authError } = await authenticateUser();
      console.log('Authentication result:', { userId, authError });
      
      if (authError || !userId) {
        console.log('Authentication failed, redirecting to signin');
        redirect('/signin');
        return { error: authError || 'Not authenticated' };
      }
  
      console.log('Fetching investments for userId:', userId);
      const { data, error } = await supabase
      .from('tradeuser_investments')
      .select(`
        id,
        plan_id,
        amount,
        expected_return,
        start_date,
        end_date,
        status,
        next_payout_date,
        total_payouts,
        tradeinvestment_plans!tradeuser_investments_plan_id_fkey (
          title,
          percentage
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  
      if (error) {
        console.log('Error fetching investments:', error);
        return { error: 'Failed to fetch investments' };
      }
  
      console.log('Retrieved investments:', data);
      return {
        data: data?.map(inv => ({
          id: inv.id,
          userId: userId,
          planId: inv.plan_id,
          amount: inv.amount,
          expectedReturn: inv.expected_return,
          startDate: inv.start_date,
          endDate: inv.end_date,
          status: inv.status as 'active' | 'completed' | 'cancelled',
          nextPayoutDate: inv.next_payout_date,
          totalPayouts: inv.total_payouts,
          planTitle: inv.tradeinvestment_plans?.[0]?.title || '',
          planPercentage: inv.tradeinvestment_plans?.[0]?.percentage || 0
        })) || []
      };
    } catch (err) {
      console.error('Unexpected error in getUserInvestments:', err);
      return { error: 'An unexpected error occurred' };
    }
  }
  

// Get investment by ID
export async function getInvestmentById(
  investmentId: string
): Promise<{ data?: UserInvestment; error?: string }> {
  console.log('Getting investment by ID:', investmentId);
  try {
    const { userId, error: authError } = await authenticateUser();
    console.log('Authentication result:', { userId, authError });
    
    if (authError || !userId) {
      console.log('Authentication failed, redirecting to signin');
      redirect('/signin');
      return { error: authError || 'Not authenticated' };
    }

    console.log('Fetching investment details for investmentId:', investmentId);
    const { data, error } = await supabase
      .from('tradeuser_investments')
      .select(`
        id,
        plan_id,
        amount,
        expected_return,
        start_date,
        end_date,
        status,
        next_payout_date,
        total_payouts,
        tradeinvestment_plans!inner(
          title,
          percentage,
          duration_days,
          interval_days
        )
      `)
      .eq('id', investmentId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.log('Error fetching investment:', error);
      return { error: 'Failed to fetch investment' };
    }

    if (!data) {
      console.log('Investment not found');
      return { error: 'Investment not found' };
    }

    console.log('Retrieved investment:', data);
    return {
        data: {
          id: data.id,
          userId: userId,
          planId: data.plan_id,
          amount: data.amount,
          expectedReturn: data.expected_return,
          startDate: data.start_date,
          endDate: data.end_date,
          status: data.status as 'active' | 'completed' | 'cancelled',
          nextPayoutDate: data.next_payout_date,
          totalPayouts: data.total_payouts,
          planTitle: data.tradeinvestment_plans?.[0]?.title || '',
          planPercentage: data.tradeinvestment_plans?.[0]?.percentage || 0
        }
      };      
  } catch (err) {
    console.error('Unexpected error in getInvestmentById:', err);
    return { error: 'An unexpected error occurred' };
  }
}

// Get all investment plans
export async function getInvestmentPlans(): Promise<{ data?: InvestmentPlan[]; error?: string }> {
  console.log('Getting all investment plans...');
  try {
    const { data, error } = await supabase
      .from('tradeinvestment_plans')
      .select('*')
      .order('min_amount', { ascending: true });

    if (error) {
      console.log('Error fetching investment plans:', error);
      return { error: 'Failed to fetch investment plans' };
    }

    console.log('Retrieved investment plans:', data);
    return { 
      data: data?.map(plan => ({
        id: plan.id,
        title: plan.title,
        percentage: plan.percentage,
        duration_days: plan.duration_days,
        min_amount: plan.min_amount,
        max_amount: plan.max_amount,
        interval_days: plan.interval_days
      })) || [] 
    };
  } catch (err) {
    console.error('Unexpected error in getInvestmentPlans:', err);
    return { error: 'An unexpected error occurred' };
  }
}

// Process investment payouts (to be run as a cron job)
export async function processInvestmentPayouts(): Promise<{ success?: boolean; error?: string }> {
  console.log('Processing investment payouts...');
  try {
    const currentDate = new Date().toISOString();
    console.log('Current date:', currentDate);
    
    const { data: dueInvestments, error } = await supabase
      .from('tradeuser_investments')
      .select(`
        *,
        tradeinvestment_plans!inner(
          percentage,
          interval_days
        )
      `)
      .lte('next_payout_date', currentDate)
      .eq('status', 'active');

    if (error) {
      console.log('Error fetching due investments:', error);
      return { error: 'Failed to fetch due investments' };
    }

    console.log('Found due investments:', dueInvestments?.length);
    
    for (const investment of dueInvestments || []) {
      console.log('Processing investment:', investment.id);
      // Process payout
      const payoutAmount = investment.amount * (investment.tradeinvestment_plans.percentage / 100);
      console.log('Calculated payout amount:', payoutAmount);
      
      // Add to user balance
      console.log('Incrementing user balance for userId:', investment.user_id);
      const { error: balanceError } = await supabase.rpc('increment_balancetrade', {
        user_id: investment.user_id,
        amount: payoutAmount
      });

      if (balanceError) {
        console.log('Error incrementing balance:', balanceError);
        continue;
      }

      // Record payout
      console.log('Recording payout...');
      const { error: payoutError } = await supabase
        .from('tradeinvestment_payouts')
        .insert({
          investment_id: investment.id,
          amount: payoutAmount,
          payout_date: currentDate
        });

      if (payoutError) {
        console.log('Error recording payout:', payoutError);
      }

      // Update investment
      const nextPayoutDate = new Date(investment.next_payout_date);
      nextPayoutDate.setDate(nextPayoutDate.getDate() + investment.tradeinvestment_plans.interval_days);
      console.log('Next payout date:', nextPayoutDate);

      const updates: {
        next_payout_date: string;
        total_payouts: number;
        updated_at: string;
        status?: 'active' | 'completed' | 'cancelled';
      } = {
        next_payout_date: nextPayoutDate.toISOString(),
        total_payouts: investment.total_payouts + 1,
        updated_at: currentDate
      };

      if (new Date(investment.end_date) <= new Date()) {
        console.log('Investment completed, marking as completed');
        updates.status = 'completed';
      }

      console.log('Updating investment with:', updates);
      const { error: updateError } = await supabase
        .from('tradeuser_investments')
        .update(updates)
        .eq('id', investment.id);

      if (updateError) {
        console.log('Error updating investment:', updateError);
      }
    }

    console.log('Payout processing completed');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in processInvestmentPayouts:', err);
    return { error: 'An unexpected error occurred' };
  }
}