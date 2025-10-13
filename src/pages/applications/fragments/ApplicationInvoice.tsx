import "@/App.css";
import Logo from "@/assets/images/logo-long.png";
// @ts-ignore
import html2pdf from "html2pdf.js";
import Button from "@/components/button/Button";
import { useLocation } from "react-router-dom";
import Chip from "@/components/chip/Chip";

export default function ApplicationInvoice() {
  const location = useLocation();
  const { applicationGroupData, applicationData } = location.state || {};

  // Array checker
  const applications = Array.isArray(applicationData) ? applicationData : [applicationData].filter(Boolean);

  // Calculations
  const subtotal = applications.reduce((sum, app) => sum + (app?.principleAmount ?? 0), 0);
  const tax = subtotal * 0.18;
  const withoutTax = subtotal - tax;
  const total = withoutTax + tax;

  const handleDownload = () => {
    const invoice = document.getElementById("invoice");
    html2pdf()
      .from(invoice)
      .set({ imageTimeout: 5000 })
      .save("Wintender-Invoice.pdf");
  };

  return (
    <div>
      <div id="invoice" className="invoice-container">
        {/* Invoice Header */}
        <div className="logo-container">
          <div className="invoice-header py-3">
            <h1 className="text-4xl">INVOICE</h1>
            <p># {applicationGroupData?.referenceNumber ?? applications[0]?.referenceNumber}</p>
            <br />
            <table className="invoice-table">
              <thead>
                <tr>
                  <td style={{ border: "none" }}>Date:</td>
                  <td style={{ border: "none" }}>
                    {applications[0]?.createdAt
                      ? new Date(applications[0]?.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}>Control Number:</td>
                  <td style={{ border: "none" }}>{applications[0]?.controlNumber}</td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}></td>
                  <td style={{ border: "none" }}>
                    <Chip
                      label={applications[0]?.paymentStatus}
                      size="sm"
                      theme={applications[0]?.paymentStatus === "SUCCESS" ? "success" : "warning"}
                      variant="outline"
                    />
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>

        {/* Company Details */}
        <div className="company-details">
          <img src={Logo} alt="WinTender Logo" className="invoice-logo" />
          <br />
          <strong>Wintender</strong>
          <p>Apply . Win . Execute</p>
          <p>
            Mbezi Beach, Along New Bagamoyo Rd, Samaki,
            <br />
            Wabichi House 2st Floor, Room A21.
          </p>
          <p>finance@wintender.tz</p>
          <p>0747 098 558</p>
        </div>

        {/* Client Details */}
        <div className="client-details">
          <h3>Bill To:</h3>
          <p><strong>{applications[0]?.bidderUserName}</strong></p>
          <p><strong>{applications[0]?.bidderCompanyName}</strong></p>
          <p>{applications[0]?.bidderCompanyEmail}</p>
          <p>{applications[0]?.bidderCompanyPhoneNumber}</p>
          <p>{applications[0]?.bidderCompanyTin}</p>
        </div>

        {/* Itemized List */}
        <table className="invoice-table">
          <thead style={{ backgroundColor: "grey", color: "white" }}>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index}>
                <td>
                  <strong>Preparation: {app?.tenderNumber}</strong>
                  <p>{app?.title}</p>
                  <small>{app?.entityName}</small>
                </td>
                <td>1</td>
                <td>
                  {new Intl.NumberFormat("en-TZ", {
                    style: "currency",
                    currency: "TZS",
                    minimumFractionDigits: 0,
                  }).format(withoutTax ?? 0)}
                </td>
                <td>
                  {new Intl.NumberFormat("en-TZ", {
                    style: "currency",
                    currency: "TZS",
                    minimumFractionDigits: 0,
                  }).format(withoutTax ?? 0)}
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan={2}></td>
              <td>Sub total:</td>
              <td>
                {new Intl.NumberFormat("en-TZ", {
                  style: "currency",
                  currency: "TZS",
                  minimumFractionDigits: 0,
                }).format(withoutTax)}
              </td>
            </tr>
            <tr>
              <td colSpan={2}></td>
              <td>Tax (18%):</td>
              <td>
                {new Intl.NumberFormat("en-TZ", {
                  style: "currency",
                  currency: "TZS",
                  minimumFractionDigits: 0,
                }).format(tax)}
              </td>
            </tr>
            <tr>
              <td colSpan={2}></td>
              <td><strong>Total:</strong></td>
              <td>
                <strong>
                  {new Intl.NumberFormat("en-TZ", {
                    style: "currency",
                    currency: "TZS",
                    minimumFractionDigits: 0,
                  }).format(total)}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payment Terms */}
        <div className="py-2">
          <strong>Payment Terms</strong>
          <table className="invoice-table">
            <tbody>
              <tr>
                <td width={400} style={{ border: "none" }}>
                  <hr className="dashed-line" />
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    100% Pre-Paid
                  </span>
                  <p>Bank name: CRDB Bank PLC</p>
                  <p>Account Name: Hatuamoja Company Limited</p>
                  <p>Account Number: 0150388028500</p>
                  <p>Branch: Goba</p>
                  <p>SwiftCode: CORUTZTZ</p>
                </td>
                <td style={{ border: "none" }}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button onClick={handleDownload} label="Download" theme="primary" size="md" />
      </div>
    </div>
  );
}
