"use server";

import { cookies } from "next/headers";
import { supabase } from "./supabaseClient";
import nodemailer from "nodemailer";
import { redirect } from "next/navigation";
// Types
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted';
export type LoanRepaymentInterval = 'weekly' | 'bi-weekly' | 'monthly';

export interface LoanPlan {
  id: string;
  title: string;
  interest: number;
  minAmount: number;
  maxAmount: number;
  durationDays: number;
  repaymentInterval: LoanRepaymentInterval;
}

export interface Loan {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  firstName?:string;
  lastName?: string;
  status: LoanStatus;
  reference: string;
  createdAt: string;
  approvedAt?: string;
  dueDate?: string;
  interestAmount: number;
  totalRepaymentAmount: number;
  repaymentSchedule: RepaymentSchedule[];
  adminNotes?: string;
  planTitle?: string;
  userEmail?: string;
  username?: string;
  purpose?: string;
}

export interface RepaymentSchedule {
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface LoanInput {
  planId: string;
  amount: number;
  purpose?: string;
}

// Helper function to authenticate user via cookies
async function authenticateUser() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
  
    if (!userId) {
      redirect('/login');
      return { error: 'Not authenticated' };
    }
  
    // Return just the user_id since we're not fetching user data
    return { user: { id: userId } };
  }

// Loan Plans Data
const loanPlans: LoanPlan[] = [
  {
    id: '1',
    title: "Quick Loan",
    interest: 5,
    minAmount: 100,
    maxAmount: 2000,
    durationDays: 30,
    repaymentInterval: 'weekly'
  },
  {
    id: '2',
    title: "Standard Loan",
    interest: 8,
    minAmount: 2000,
    maxAmount: 10000,
    durationDays: 90,
    repaymentInterval: 'monthly'
  },
  {
    id: '3',
    title: "Business Boost",
    interest: 12,
    minAmount: 10000,
    maxAmount: 50000,
    durationDays: 180,
    repaymentInterval: 'monthly'
  }
];

 

async function sendLoanNotificationToAdmin(params: {
  userId: string;
  userEmail: string;
  amount: number;
  planId: string;
  loanId: string;
  purpose?: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const plan = loanPlans.find(p => p.id === params.planId);

    const mailOptions = {
      from: `Your Company Name <${process.env.EMAIL_USERNAME}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Loan Request - $${params.amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2a52be;">New Loan Request</h2>
          <p><strong>User ID:</strong> ${params.userId}</p>
          <p><strong>User Email:</strong> ${params.userEmail}</p>
          <p><strong>Loan Plan:</strong> ${plan?.title || params.planId}</p>
          <p><strong>Amount:</strong> $${params.amount}</p>
          ${params.purpose ? `<p><strong>Purpose:</strong> ${params.purpose}</p>` : ''}
          <p><strong>Loan ID:</strong> ${params.loanId}</p>
          
          <div style="margin-top: 30px;">
            <a href="${process.env.ADMIN_URL}/loans/${params.loanId}/approve" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Approve Loan
            </a>
            <a href="${process.env.ADMIN_URL}/loans/${params.loanId}/reject" 
               style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">
              Reject Loan
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Loan notification email sent to admin');
  } catch (error) {
    console.error('Failed to send loan notification email:', error);
  }
}

function calculateRepaymentSchedule(plan: LoanPlan, amount: number, approvalDate: Date): RepaymentSchedule[] {
  const totalInterest = (amount * plan.interest) / 100;
  const totalRepayment = amount + totalInterest;
  
  const schedule: RepaymentSchedule[] = [];
  const durationDays = plan.durationDays;
  
  if (plan.repaymentInterval === 'weekly') {
    const weeks = Math.ceil(durationDays / 7);
    const weeklyAmount = totalRepayment / weeks;
    
    for (let i = 1; i <= weeks; i++) {
      const dueDate = new Date(approvalDate);
      dueDate.setDate(dueDate.getDate() + (i * 7));
      schedule.push({
        dueDate: dueDate.toISOString(),
        amount: parseFloat(weeklyAmount.toFixed(2)),
        status: 'pending'
      });
    }
  } else if (plan.repaymentInterval === 'monthly') {
    const months = Math.ceil(durationDays / 30);
    const monthlyAmount = totalRepayment / months;
    
    for (let i = 1; i <= months; i++) {
      const dueDate = new Date(approvalDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      schedule.push({
        dueDate: dueDate.toISOString(),
        amount: parseFloat(monthlyAmount.toFixed(2)),
        status: 'pending'
      });
    }
  } else { // bi-weekly
    const periods = Math.ceil(durationDays / 14);
    const periodAmount = totalRepayment / periods;
    
    for (let i = 1; i <= periods; i++) {
      const dueDate = new Date(approvalDate);
      dueDate.setDate(dueDate.getDate() + (i * 14));
      schedule.push({
        dueDate: dueDate.toISOString(),
        amount: parseFloat(periodAmount.toFixed(2)),
        status: 'pending'
      });
    }
  }
  
  return schedule;
}

// Main Functions
export async function getLoanPlans(): Promise<{ data?: LoanPlan[]; error?: string }> {
  try {
    return { data: loanPlans };
  } catch (err) {
    console.error('Unexpected error in getLoanPlans:', err);
    return { error: 'An unexpected error occurred' };
  }
}

export async function initiateLoan(input: LoanInput): Promise<{ success?: boolean; error?: string; loanId?: string }> {
    try {
      // Authentication check
      const { user, error: authError } = await authenticateUser();
      if (authError || !user) {
        return { error: authError || 'Not authenticated' };
      }
  
      const userId = user.id;
  
      // First check if plan exists in local array (for quick validation)
      const localPlan = loanPlans.find(p => p.id === input.planId);
      if (!localPlan) {
        return { error: 'Invalid loan plan ID' };
      }
  
      // Verify the plan exists in database (double-check)
      const { data: dbPlan, error: planError } = await supabase
        .from('loan_plans')
        .select('*')
        .eq('id', input.planId)
        .single();
  
      if (planError || !dbPlan) {
        console.error('Plan not found in database:', input.planId);
        return { error: 'Loan plan not available' };
      }
  
      // Validate amount against plan limits
      const minAmount = Number(dbPlan.min_amount);
      const maxAmount = Number(dbPlan.max_amount);
      
      if (input.amount < minAmount || input.amount > maxAmount) {
        return { 
          error: `Amount must be between $${minAmount.toLocaleString()} and $${maxAmount.toLocaleString()} for this plan` 
        };
      }
  
      // Calculate loan details
      const reference = `LOAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const interestRate = Number(dbPlan.interest);
      const interestAmount = (input.amount * interestRate) / 100;
      const totalRepaymentAmount = input.amount + interestAmount;
  
      // Create loan record
      const { data: loan, error: loanError } = await supabase
        .from('loans')
        .insert([{
          user_id: userId,
          plan_id: input.planId,
          amount: input.amount,
          status: 'pending',
          reference,
          purpose: input.purpose,
          interest_amount: interestAmount,
          total_repayment_amount: totalRepaymentAmount,
          interest_rate: interestRate
        }])
        .select()
        .single();
  
      if (loanError || !loan) {
        console.error('Loan creation failed:', loanError);
        return { 
          error: loanError?.message || 'Failed to initiate loan',
          ...(loanError?.code && { code: loanError.code })
        };
      }
  
      // Get user details for notification
      const { data: userData, error: userError } = await supabase
        .from('tradingprofile')
        .select('email, username')
        .eq('id', userId)
        .single();
  
      if (userError || !userData) {
        console.error('Failed to fetch user details:', userError);
        // Still return success since loan was created, just log the notification failure
        console.warn('Loan created but notification failed');
        return { success: true, loanId: loan.id };
      }
  
      // Send admin notification
      await sendLoanNotificationToAdmin({
        userId,
        userEmail: userData.email || '',
        amount: input.amount,
        planId: input.planId,
        loanId: loan.id,
        purpose: input.purpose
      });
  
      return { success: true, loanId: loan.id };
    } catch (err) {
      console.error('Unexpected error in initiateLoan:', err);
      return { 
        error: 'An unexpected error occurred',
        ...(err instanceof Error && { details: err.message })
      };
    }
  }


  export async function approveLoan(loanId: string): Promise<{ success?: boolean; error?: string; currentStatus?: string }> {
    try {
      // First fetch the loan details
      const { data: loan, error: fetchError } = await supabase
        .from('loans')
        .select('status, user_id, amount, plan_id, interest_amount, total_repayment_amount')
        .eq('id', loanId)
        .single();
  
      if (fetchError || !loan) {
        console.error('Loan fetch failed:', fetchError);
        return { error: 'Loan not found' };
      }
  
      if (loan.status !== 'pending') {
        return { 
          error: 'Loan already processed',
          currentStatus: loan.status 
        };
      }
  
      const plan = loanPlans.find(p => p.id === loan.plan_id);
      if (!plan) {
        return { error: 'Loan plan not found' };
      }
  
      const approvalDate = new Date();
      const dueDate = new Date(approvalDate);
      dueDate.setDate(dueDate.getDate() + plan.durationDays);
      
      const repaymentSchedule = calculateRepaymentSchedule(plan, loan.amount, approvalDate);
  
      // Update the loan status and repayment schedule
      const { error: updateError } = await supabase
        .from('loans')
        .update({ 
          status: 'approved',
          approved_at: approvalDate.toISOString(),
          due_date: dueDate.toISOString(),
          repayment_schedule: repaymentSchedule
        })
        .eq('id', loanId);
  
      if (updateError) {
        console.error('Approval failed:', updateError);
        return { error: 'Failed to approve loan' };
      }
  
      // First get current balance
      const { data: profile, error: profileError } = await supabase
        .from('tradingprofile')
        .select('balance, email, first_name')
        .eq('id', loan.user_id)
        .single();
  
      if (profileError || !profile) {
        console.error('Profile fetch failed:', profileError);
        return { error: 'User trading profile not found' };
      }
  
      const newBalance = (profile.balance || 0) + loan.amount;
      
      const { error: balanceError } = await supabase
        .from('tradingprofile')
        .update({ balance: newBalance })
        .eq('id', loan.user_id);
  
      if (balanceError) {
        console.error('Balance update failed:', balanceError);
        return { error: 'Failed to update user balance' };
      }

      // Send loan approval email
      console.log('Preparing to send loan approval email...');
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: `TTradeCapital Loans <${process.env.EMAIL_USERNAME}>`,
          to: profile.email,
          subject: `Loan Approved - $${loan.amount.toFixed(2)}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; background-image: url('https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181342/photo-1563986768711-b3bde3dc821e_o5hj2v.avif'); background-size: cover; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <div style="background-color: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 8px;">
                <img src="https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181473/ima_m8am4h.jpg" alt="TTradeCapital Logo" style="max-width: 200px; margin-bottom: 20px;">
                
                <h2 style="color: #4a90e2; margin-top: 0; font-weight: 600;">Loan Application Approved</h2>
                
                <p style="line-height: 1.6;">Dear ${profile.first_name || 'Valued Client'},</p>
                
                <p style="line-height: 1.6;">We are pleased to inform you that your loan application has been approved and the funds have been credited to your trading account. Below are the details of your approved loan:</p>
                
                <div style="background-color: rgba(74, 144, 226, 0.1); padding: 20px; border-left: 4px solid #4a90e2; margin: 25px 0; border-radius: 4px;">
                  <p style="margin: 8px 0; font-weight: 500;">Loan Amount: <span style="color: #4a90e2;">$${loan.amount.toFixed(2)}</span></p>
                  <p style="margin: 8px 0; font-weight: 500;">Interest Rate: <span style="color: #4a90e2;">${plan.interest}%</span></p>
                  <p style="margin: 8px 0; font-weight: 500;">Total Repayment: <span style="color: #4a90e2;">$${loan.total_repayment_amount.toFixed(2)}</span></p>
                  <p style="margin: 8px 0; font-weight: 500;">Loan ID: <span style="color: #4a90e2;">${loanId}</span></p>
                  <p style="margin: 8px 0; font-weight: 500;">Approval Date: <span style="color: #4a90e2;">${approvalDate.toLocaleDateString()}</span></p>
                  <p style="margin: 8px 0; font-weight: 500;">Due Date: <span style="color: #4a90e2;">${dueDate.toLocaleDateString()}</span></p>
                  <p style="margin: 8px 0; font-weight: 500;">Loan Term: <span style="color: #4a90e2;">${plan.durationDays} days</span></p>
                </div>
                
                <p style="line-height: 1.6;">The approved loan amount of $${loan.amount.toFixed(2)} has been successfully deposited into your trading account balance and is now available for immediate use.</p>
                
                <p style="line-height: 1.6;"><strong>Repayment Information:</strong></p>
                <ul style="line-height: 1.6; padding-left: 20px;">
                  <li>Your repayment amount of $${loan.total_repayment_amount.toFixed(2)} will be automatically deducted on ${dueDate.toLocaleDateString()}</li>
                  <li>You may make early repayments at any time without penalty</li>
                  <li>Funds will be deducted from your available trading balance</li>
                </ul>
                
                <div style="background-color: rgba(76, 175, 80, 0.1); padding: 15px; border-left: 4px solid #4CAF50; border-radius: 4px; margin: 20px 0;">
                  <p style="line-height: 1.6; margin: 0; font-weight: 500; color: #4CAF50;">Next Steps:</p>
                  <p style="line-height: 1.6; margin: 8px 0 0 0;">You can now access your loan funds in your trading account. Monitor your repayment schedule and account balance through your dashboard.</p>
                </div>
                
                <p style="line-height: 1.6;">Should you have any questions about your loan or need assistance with your account, our support team is available 24/7 at </p>
                
                <div style="margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                  <p style="margin: 5px 0;">Best regards,</p>
                  <p style="margin: 5px 0; font-weight: 600;">TTradeCapital Loans Department</p>
                  <p style="margin: 5px 0; font-size: 12px; color: rgba(255,255,255,0.6);">Credit Services Division</p>
                </div>
                
                <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 30px; line-height: 1.5;">
                  <strong>Important:</strong> This is an automated notification. Please do not reply to this email directly. 
                  TTradeCapital will never ask for your password or sensitive information via email. 
                  All loan agreements are subject to our Terms and Conditions available on our website.
                </p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Loan approval email sent successfully');
      } catch (emailError) {
        console.error('Failed to send loan approval email:', emailError);
        // Continue even if email fails
      }
  
      return { success: true };
    } catch (err) {
      console.error('Unexpected error in approveLoan:', err);
      return { error: 'An unexpected error occurred' };
    }
}



export async function rejectLoan(loanId: string, adminNotes: string = ''): Promise<{ success?: boolean; error?: string; currentStatus?: string }> {
  try {
    const { data: loan, error: fetchError } = await supabase
      .from('loans')
      .select('status, user_id, amount, plan_id')
      .eq('id', loanId)
      .single();

    if (fetchError || !loan) {
      console.error('Loan fetch failed:', fetchError);
      return { error: 'Loan not found' };
    }

    if (loan.status !== 'pending') {
      return { 
        error: 'Loan already processed',
        currentStatus: loan.status 
      };
    }

    const rejectionDate = new Date();
    const { error: updateError } = await supabase
      .from('loans')
      .update({ 
        status: 'rejected',
        processed_at: rejectionDate.toISOString(),
        admin_notes: adminNotes
      })
      .eq('id', loanId);

    if (updateError) {
      console.error('Rejection failed:', updateError);
      return { error: 'Failed to reject loan' };
    }

    // Send loan rejection email
    console.log('Preparing to send loan rejection email...');
    try {
      const { data: profile, error: profileError } = await supabase
        .from('tradingprofile')
        .select('email, first_name')
        .eq('id', loan.user_id)
        .single();

      if (!profileError && profile) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const plan = loanPlans.find(p => p.id === loan.plan_id);
        const mailOptions = {
          from: `TTradeCapital Loans <${process.env.EMAIL_USERNAME}>`,
          to: profile.email,
          subject: `Loan Application Update - #${loanId}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; background-image: url('https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181342/photo-1563986768711-b3bde3dc821e_o5hj2v.avif'); background-size: cover; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <div style="background-color: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 8px;">
                <img src="https://res.cloudinary.com/dqhllq2ht/image/upload/v1754181473/ima_m8am4h.jpg" alt="TTradeCapital Logo" style="max-width: 200px; margin-bottom: 20px;">
                
                <h2 style="color: #e74c3c; margin-top: 0; font-weight: 600;">Loan Application Review Complete</h2>
                
                <p style="line-height: 1.6;">Dear ${profile.first_name || 'Valued Client'},</p>
                
                <p style="line-height: 1.6;">We regret to inform you that after careful consideration, your recent loan application could not be approved at this time. Below are the details of your application:</p>
                
                <div style="background-color: rgba(231, 76, 60, 0.1); padding: 20px; border-left: 4px solid #e74c3c; margin: 25px 0; border-radius: 4px;">
                  <p style="margin: 8px 0; font-weight: 500;">Loan Amount: <span style="color: #e74c3c;">$${loan.amount.toFixed(2)}</span></p>
                  <p style="margin: 8px 0; font-weight: 500;">Loan ID: <span style="color: #e74c3c;">${loanId}</span></p>
                  <p style="margin: 8px 0; font-weight: 500;">Application Date: <span style="color: #e74c3c;">${rejectionDate.toLocaleDateString()}</span></p>
                  ${plan ? `<p style="margin: 8px 0; font-weight: 500;">Loan Plan: <span style="color: #e74c3c;">${plan.id} (${plan.durationDays} days)</span></p>` : ''}
                </div>
                
                <div style="background-color: rgba(241, 196, 15, 0.1); padding: 15px; border-left: 4px solid #f1c40f; border-radius: 4px; margin: 20px 0;">
                  <p style="line-height: 1.6; margin: 0; font-weight: 500; color: #f1c40f;">Decision Notes:</p>
                  <p style="line-height: 1.6; margin: 8px 0 0 0;">${adminNotes || 'Our credit team found your application did not meet our current lending criteria. This decision was based on our risk assessment policies.'}</p>
                </div>
                
                <p style="line-height: 1.6;"><strong>Next Steps:</strong></p>
                <ul style="line-height: 1.6; padding-left: 20px;">
                  <li>You may review your account standing in your dashboard</li>
                  <li>Consider applying again after 30 days</li>
                  <li>Improve your eligibility by maintaining positive trading activity</li>
                </ul>
                
                <p style="line-height: 1.6;">We understand this news may be disappointing and encourage you to contact our loans team to discuss:</p>
                <ul style="line-height: 1.6; padding-left: 20px;">
                  <li>Specific reasons for this decision</li>
                  <li>Ways to improve future eligibility</li>
                  <li>Alternative financing options</li>
                </ul>
                
                <div style="margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                  <p style="margin: 5px 0;">For assistance, contact our Loans Team:</p>
                  <p style="margin: 5px 0; font-weight: 500;">Email: <a href="mailto:loans@ttradecapital.com" style="color: #4a90e2; text-decoration: none;">loans@ttradecapital.com</a></p>
                  <p style="margin: 5px 0; font-weight: 500;">Phone: +1 (800) 123-4567</p>
                  <p style="margin: 5px 0; font-size: 12px; color: rgba(255,255,255,0.6);">Available Mon-Fri, 9AM-5PM EST</p>
                </div>
                
                <p style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 30px; line-height: 1.5;">
                  <strong>Note:</strong> This decision does not affect your ability to trade or use other TTradeCapital services. 
                  All lending decisions are final but you may reapply after 30 days. 
                  This email was automatically generated - please do not reply directly.
                </p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Loan rejection email sent successfully');
      }
    } catch (emailError) {
      console.error('Failed to send loan rejection email:', emailError);
      // Continue even if email fails
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error in rejectLoan:', err);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getUserLoans(
  filters: {
    status?: LoanStatus;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ data?: Loan[]; error?: string; count?: number }> {
  try {
    const { user, error: authError } = await authenticateUser();
    if (authError || !user) {
      return { error: authError || 'Not authenticated' };
    }

    const userId = user.id;

    let query = supabase
      .from('loans')
      .select(`
        id,
        user_id,
        plan_id,
        amount,
        status,
        reference,
        created_at,
        approved_at,
        due_date,
        interest_amount,
        total_repayment_amount,
        repayment_schedule,
        admin_notes,
        purpose,
        loan_plans:plan_id (title)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset !== undefined && filters.limit) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching loans:', error);
      return { error: 'Failed to fetch loans' };
    }

    const mappedData = data?.map(loan => ({
      id: loan.id,
      userId: loan.user_id,
      planId: loan.plan_id,
      amount: loan.amount,
      status: loan.status,
      reference: loan.reference,
      createdAt: loan.created_at,
      approvedAt: loan.approved_at,
      dueDate: loan.due_date,
      interestAmount: loan.interest_amount,
      totalRepaymentAmount: loan.total_repayment_amount,
      repaymentSchedule: loan.repayment_schedule || [],
      adminNotes: loan.admin_notes,
      purpose: loan.purpose,
      planTitle: (loan.loan_plans as unknown as { title: string })?.title,
    })) || [];

    return {
      data: mappedData,
      count: count || 0
    };
  } catch (err) {
    console.error('Unexpected error in getUserLoans:', err);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getAllLoans(
  filters: {
    status?: LoanStatus;
    userId?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ data?: Loan[]; error?: string; count?: number }> {
  try {
    // For admin functions, we might still want to authenticate
    const { error: authError } = await authenticateUser();
    if (authError) {
      return { error: authError };
    }

    let query = supabase
      .from('loans')
      .select(`
        id,
        user_id,
        plan_id,
        amount,
        status,
        reference,
        created_at,
        approved_at,
        due_date,
        interest_amount,
        total_repayment_amount,
        repayment_schedule,
        admin_notes,
        purpose,
        loan_plans:plan_id (title),
        tradingprofile:user_id (email, first_name, last_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset !== undefined && filters.limit) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching loans:', error);
      return { error: 'Failed to fetch loans' };
    }

    const mappedData = data?.map(loan => ({
      id: loan.id,
      userId: loan.user_id,
      planId: loan.plan_id,
      amount: loan.amount,
      status: loan.status,
      reference: loan.reference,
      createdAt: loan.created_at,
      approvedAt: loan.approved_at,
      dueDate: loan.due_date,
      interestAmount: loan.interest_amount,
      totalRepaymentAmount: loan.total_repayment_amount,
      adminNotes: loan.admin_notes,
      purpose: loan.purpose,
      repaymentSchedule: loan.repayment_schedule,
      planTitle: (loan.loan_plans as unknown as { title: string })?.title,
      userEmail: (loan.tradingprofile as unknown as { email: string })?.email,
      firstName: (loan.tradingprofile as unknown as { first_name: string })?.first_name,
      lastName: (loan.tradingprofile as unknown as { last_name: string })?.last_name
    })) || [];

    return {
      data: mappedData,
      count: count || 0
    };
  } catch (err) {
    console.error('Unexpected error in getAllLoans:', err);
    return { error: 'An unexpected error occurred' };
  }
}