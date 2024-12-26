const PDFDocument = require("pdfkit");

exports.generateResume = (req, res) => {
  const {
    name,
    summary,
    workExperience,
    academicHistory,
    contact,
    certifications,
  } = req.body;

  try {
    const doc = new PDFDocument({
      margin: 40,
    });

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      });
      res.send(pdfData);
    });

    // Header: Name and Line
    doc
      .fontSize(26)
      .font("Helvetica-Bold")
      .text(name, { align: "left" })
      .moveDown(0.5);
    doc
      .moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke("#E63946")
      .moveDown(1);

    // Professional Summary
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("black")
      .text("Professional Summary", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("black")
      .text(summary || "Not provided")
      .moveDown(1);

    // Work Experience
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Work Experience", { underline: true })
      .moveDown(0.5);

    workExperience.forEach((experience) => {
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(
          `${experience.title} | ${experience.location} | ${experience.timeline}`
        );
      experience.description.forEach((desc) => {
        doc.fontSize(12).font("Helvetica").text(`• ${desc}`, { indent: 20 });
      });
      doc.moveDown(0.5);
    });

    // Academic History
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Academic History", { underline: true })
      .moveDown(0.5);

    academicHistory.forEach((academic) => {
      doc.fontSize(12).font("Helvetica-Bold").text(academic.college);
      doc
        .fontSize(12)
        .font("Helvetica")
        .text(academic.description, { indent: 20 })
        .moveDown(0.5);
    });

    // Contact Details
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Contact Details", { underline: true })
      .moveDown(0.5);

    doc.fontSize(12).font("Helvetica").text(`Phone: ${contact.phone}`);
    doc.text(`Email: ${contact.email}`);
    doc.text(`Address: ${contact.address}`);
    if (contact.portfolio) {
      doc.text(`Portfolio: ${contact.portfolio}`);
    }
    doc.moveDown(1);

    // Certifications
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Certifications", { underline: true })
      .moveDown(0.5);

    certifications.forEach((cert) => {
      doc
        .fontSize(12)
        .font("Helvetica")
        .text(`${cert.name}: ${cert.link}`, { indent: 20 })
        .moveDown(0.5);
    });

    // Footer
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Generated with Pathfinder AI Resume Builder", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};
