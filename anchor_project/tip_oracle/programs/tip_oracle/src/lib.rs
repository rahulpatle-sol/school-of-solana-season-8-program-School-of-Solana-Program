use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

declare_id!("75zeKfzrc1CzfcC6fDT3gYwTeYgqMoEkfSjbLHMykaVE");

#[program]
pub mod tip_oracle {
    use super::*;

    pub fn initialize_creator(ctx: Context<InitializeCreator>) -> Result<()> {
        let creator_account = &mut ctx.accounts.creator_account;

        creator_account.total_tips = 0;
        creator_account.last_tipper = Pubkey::default();
        creator_account.creator = ctx.accounts.creator.key();   // STORE CREATOR
        creator_account.bump = ctx.bumps.creator_account;       // NEW ANCHOR 0.30 SYNTAX

        Ok(())
    }

    pub fn send_tip(ctx: Context<SendTip>, amount: u64) -> Result<()> {
        let payer = &ctx.accounts.payer;
        let creator = &ctx.accounts.creator;
        let creator_account = &mut ctx.accounts.creator_account;

        // Lamport transfer
        let ix = system_instruction::transfer(&payer.key(), &creator.key(), amount);

        invoke(
            &ix,
            &[
                payer.to_account_info(),
                creator.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Update PDA stats
        creator_account.total_tips = creator_account
            .total_tips
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        creator_account.last_tipper = payer.key();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCreator<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + 8 + 32 + 32 + 1,
        seeds = [b"tipping", creator.key().as_ref()],
        bump
    )]
    pub creator_account: Account<'info, CreatorAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SendTip<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub creator: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [b"tipping", creator.key().as_ref()],
        bump = creator_account.bump,
        has_one = creator
    )]
    pub creator_account: Account<'info, CreatorAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct CreatorAccount {
    pub total_tips: u64,
    pub last_tipper: Pubkey,
    pub creator: Pubkey,   // REQUIRED FOR has_one
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Overflow on u64 addition")]
    Overflow,
}
