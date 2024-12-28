import "@/App.css";
import Logo from "@/assets/images/logo-long.png";

// @ts-ignore
import html2pdf from "html2pdf.js";
import Button from "@/components/button/Button";
import { useLocation } from "react-router-dom";

export default function ApplicationInvoice() {

  const location = useLocation();

  const { applicationGroupData, applicationData } = location.state || {};

  const handleDownload = () => {
    const invoice = document.getElementById("invoice");
    html2pdf()
      .from(invoice)
      .set({
        imageTimeout: 5000
      })
      .save("Invoice-" + applicationData?.tender?.referenceNumber + ".pdf");
  };

  return (
    <div>
      {/* The invoice content */}
      <div id="invoice" className="invoice-container">
        <div className="logo-container">
          <div className="invoice-header py-3">
          <h1 className="text-4xl">INVOICE</h1>
            <p># {applicationData?.tender?.referenceNumber}</p>
            <br></br>
            <table className="invoice-table">
              <thead>
                <tr>
                  <td style={{ border: 'none' }}>Date:</td>
                  <td style={{ border: 'none' }}>
                    {applicationData?.tender?.createdAt ?
                      new Date(applicationData?.tender.createdAt).toLocaleDateString() :
                      'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: 'none' }}>Control Number:</td>
                  <td style={{ border: 'none' }}>{applicationData?.controlNumber?.controlNumber}</td>
                </tr>
                <tr>
                  <td style={{ border: 'none' }}>Payment Terms:</td>
                  <td style={{ border: 'none' }}>100%
                  </td>
                </tr>
                <tr style={{ backgroundColor: 'grey', color: 'white' }}>
                  <th style={{ border: 'none' }}><strong>Balance Due:</strong></th>
                  <th style={{ border: 'none' }}>
                    <strong>
                      {new Intl.NumberFormat('en-TZ', {
                        style: 'currency',
                        currency: 'TZS',
                        minimumFractionDigits: 0,
                      }).format(applicationData?.controlNumber.principleAmount ?? 0)}
                    </strong>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        {/* Company Details */}
        <div className="company-details">
          <img
            src={Logo}
            alt="WinTender Logo"
            className="invoice-logo"
          />
          <br></br>
          <strong>Wintender</strong>
          <p>Apply . Win . Execute</p>
          <p>Mbezi Beach, Along New Bagamoyo Rd, Samaki,<br></br>
            Wabichi House 1st Floor.</p>
          <p>finance@wintender.tz</p>
          <p>0800 000 000</p>
        </div>

        {/* Client Details */}
        <div className="client-details">
          <h3>Bill To:</h3>
          <p><strong>{applicationGroupData?.user.name}</strong></p>
          <p>{applicationGroupData?.user.address}</p>
          <p>{applicationGroupData?.user.email}</p>
          <p>{applicationGroupData?.user.phoneNumber}</p>
        </div>

        {/* Itemized List */}
        <table className="invoice-table">
          <thead style={{ backgroundColor: 'grey', color: 'white' }}>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody style={{ border: 'none' }}>
            <tr style={{ border: 'none' }}>
              <td style={{ border: 'none' }}>
                <strong>Preparation: {applicationData?.tender?.tenderNumber}</strong>
                <p>{applicationData?.tender?.title}</p>
              </td>
              <td style={{ border: 'none' }}>1</td>
              <td style={{ border: 'none' }}>
                {new Intl.NumberFormat('en-TZ', {
                  style: 'currency',
                  currency: 'TZS',
                  minimumFractionDigits: 0,
                }).format(applicationData?.controlNumber.principleAmount ?? 0)}
              </td>
              <td style={{ border: 'none' }}>
                {new Intl.NumberFormat('en-TZ', {
                  style: 'currency',
                  currency: 'TZS',
                  minimumFractionDigits: 0,
                }).format(applicationData?.controlNumber.principleAmount ?? 0)}
              </td>
            </tr>
            <tr>
              <td colSpan={4} style={{ border: 'none' }}>
                {applicationData?.tender?.entity.name},<br></br>
                {applicationData?.tender?.entity.primaryNumber},<br></br>
                {applicationData?.tender?.entity.address}, Tanzania<br></br>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}>Sub total:</td>
              <td style={{ border: 'none' }}>{new Intl.NumberFormat('en-TZ', {
                style: 'currency',
                currency: 'TZS',
                minimumFractionDigits: 0,
              }).format(applicationData?.controlNumber.principleAmount ?? 0)}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}>Tax (0%):</td>
              <td style={{ border: 'none' }}>0</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: 'none' }}></td>
              <td style={{ border: 'none' }}><strong>Total:</strong></td>
              <td style={{ border: 'none' }}><strong>{new Intl.NumberFormat('en-TZ', {
                style: 'currency',
                currency: 'TZS',
                minimumFractionDigits: 0,
              }).format(applicationData?.controlNumber.principleAmount ?? 0)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div className="py-2">
          <strong>Notes</strong>
          <table className="invoice-table">
            <tbody>
              <tr>
                <td width={400} style={{ border: 'none' }}>
                  <p >BANK DETAILS</p>

                  <hr className="dashed-line" />

                  <p>Bank name: CRDB Bank PLC</p>
                  <p>Account Name: Hatuamoja Company Limited</p>
                  <p>Account Number: 0150388028500</p>
                  <p>Branch: Goba</p>
                  <p>SwiftCode: CORUTZTZ</p>

                </td>
                <td style={{ border: 'none' }}></td>
              </tr>
              <tr>
                <td style={{ border: 'none' }}>
                  <p>WAKALA JINA: HATUAMOJA COMPANY LIMITED</p>

                  <hr className="dashed-line" />

                  <p>Mixx by YAS : 678079</p>
                  <p>MPesa : 593337</p>
                </td>
                <td style={{ border: 'none' }}></td>
              </tr>
            </tbody>
          </table>
        </div>


      </div>

      {/* Download Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          onClick={handleDownload}
          label="Download"
          theme="primary"
          size="md"
        />
      </div>
    </div>
  );
}
