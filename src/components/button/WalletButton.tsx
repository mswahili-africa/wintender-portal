import { ICompany } from '@/types'
import { IconWallet } from '@tabler/icons-react'
import Tooltip from '../tooltip/Tooltip';
import { t } from 'i18next';
interface IWalletButtonProps {
    amount?: number;
    onClick?: () => void;
}
export const WalletButton = ({ amount, onClick }: IWalletButtonProps) => {
    return (
        <Tooltip content={t("header-wallet-button")}>
            <div onClick={onClick} className="flex cursor-pointer justify-center w-full items-center p-2 h-8 bg-green-50 rounded-lg focus:outline-none ring-2 ring-green-600">
                <div className="flex justify-center items-center w-9 h-9 rounded-md">
                    <IconWallet className="text-slate-500" />
                </div>
                <p className="ml-2 text-center text-md uppercase text-slate-500 font-medium whitespace-nowrap">
                    {new Intl.NumberFormat().format(amount ?? 0)} TZS
                </p>
            </div>
        </Tooltip>
    )
}
