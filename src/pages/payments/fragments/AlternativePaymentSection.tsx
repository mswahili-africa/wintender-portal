import React from 'react'
import { Trans, useTranslation } from 'react-i18next';

export const AlternativePaymentSection = () => {
    const {t} = useTranslation();
    return (
        <div className="px-5 py-2 sm:border-l-4 sm:border-green-600 ps-3 text-sm">
            <p className="text-sm"><span className="text-green-600 font-bold text-lg">{t("payment-modal-alternatively")},</span> </p>
            <p className="text-sm mb-2">{t("payment-modal-you-can-pay-with-lipa")}: </p>
            <div className="flex flex-col sm:flex-row gap-x-5 my-1 w-full justify-center sm:justify-between">
                <div>
                    <div className="flex flex-row gap-x-5 my-1 items-center">
                        <img src="/payment_logo/voda.png" className="w-8 h-8 rounded-lg" alt="" />
                        <p className="text-lg font-bold">58224582</p>
                    </div>
                    <p>{t("payment-modal-lipa-name")}: <span className="text-md font-bold">WINTENDER P SHOP</span></p>
                </div>
                <img className="object-fit  h-28 w-28 sm:h-20 sm:w-20 mx-auto" src='/payment_logo/wintender_lipa.png' alt="qr code" />
            </div>

            <div className="font-bold text-green-600 text-md w-full sm:my-3 my-6">--------{t("payment-modal-or")}--------</div>

            <p className="text-sm mb-2">{t("payment-modal-you-can-pay-with")}: </p>
            <p>{t("payment-modal-bank-name")}: <span className="text-md font-bold">CRDB Bank PLC</span></p>
            <p>{t("payment-modal-account-name")}: <span className="text-md font-bold">Hatuamoja Company Limited</span></p>
            <p>{t("payment-modal-account-number")}: <span className="text-md font-bold">0150388028500</span></p>
            <p>{t("payment-modal-branch")}: <span className="text-md font-bold">Goba</span></p>
            <p>{t("payment-modal-swift-code")}: <span className="text-md font-bold">CORUTZTZ</span></p>

            {/* General instructions with emphasis */}
            <div className="font-bold text-green-600 my-3">{t("payment-modal-instructions")}:</div>
            <p className="text-center text-sm text-red-600">
                <Trans
                    i18nKey="payment-share-proof"
                    components={{
                        email: <a href="mailto:finance@wintender.co.tz" target="_blank" className="font-semibold text-blue-600 hover:underline" />,
                        phone: (
                            <a href="https://wa.me/255747098558" target='_blank' className="font-semibold text-blue-600 hover:underline" />
                        ),
                    }}
                    values={{
                        email: "finance@wintender.co.tz",
                        phone: "+255747098558",
                    }}
                />
            </p>
        </div>
    )
}
