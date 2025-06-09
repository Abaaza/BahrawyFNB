const { getClinicalStatements } = require('./db');

async function generateDraftReport(caseData) {
  const statements = await getClinicalStatements();

  const report = {
    modificationsSummary: [],
    attachments: [],
    IPR: null,
    photos: caseData.photos || [],
    clincheckLink: caseData.clincheckLink || '',
    notes: caseData.notes || '',
  };

  if (caseData.hasIPR) {
    const ipr = statements.find((s) => s.key === 'ipr');
    if (ipr) {
      report.IPR = ipr.text;
    }
  }

  if (caseData.hasAttachments) {
    const attach = statements.find((s) => s.key === 'attachment');
    if (attach) {
      report.attachments.push(attach.text);
    }
  }

  // default summary using any statements flagged as 'summary'
  statements
    .filter((s) => s.key === 'summary')
    .forEach((s) => report.modificationsSummary.push(s.text));

  return report;
}

module.exports = {
  generateDraftReport,
};
