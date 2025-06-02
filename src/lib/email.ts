export async function sendDepositEmailToAdmin(params: {
    userEmail: string
    amount: number
    reference: string
    userId: string
    cryptoType: string
    transactionId: string
  }) {
    // You can implement real email logic here (e.g. using Nodemailer, Resend, etc.)
    console.log('Admin notification sent:', {
      userEmail: params.userEmail,
      amount: params.amount,
      reference: params.reference,
      userId: params.userId,
      cryptoType: params.cryptoType,
      transactionId: params.transactionId,
    });
  }


  export async function sendWithdrawalEmailToAdmin(params: {
    userEmail: string
    amount: number
    reference: string
    userId: string
    cryptoType: string
    transactionId: string
    walletAddress :string
  }) {
    // You can implement real email logic here (e.g. using Nodemailer, Resend, etc.)
    console.log('Admin notification sent:', {
      userEmail: params.userEmail,
      amount: params.amount,
      reference: params.reference,
      userId: params.userId,
      cryptoType: params.cryptoType,
      walletAddress : params.walletAddress,
      transactionId: params.transactionId,
    });
  }
  