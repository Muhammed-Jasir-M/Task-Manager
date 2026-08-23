import jsPDF from 'jspdf';

export const generateTaskPDF = (task) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Color definitions
    const colors = {
      headerBg: [15, 23, 42],      // Slate 900
      indigo: [99, 102, 241],      // Indigo 500
      slateLight: [248, 250, 252], // Slate 50
      slateBorder: [226, 232, 240],// Slate 200
      textPrimary: [30, 41, 59],   // Slate 800
      textSecondary: [100, 116, 139], // Slate 500
      high: [225, 29, 72],         // Rose 600
      medium: [217, 119, 6],       // Amber 600
      low: [16, 185, 129],         // Emerald 500
      todo: [234, 88, 12],         // Orange 600
      inProgress: [37, 99, 235],   // Blue 600
      done: [16, 185, 129]          // Emerald 500
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return 'Invalid Date';
      }
    };

    // 1. TOP HEADER BANNER
    pdf.setFillColor(...colors.headerBg);
    pdf.rect(0, 0, pageWidth, 42, 'F');

    // Accent line below header
    pdf.setFillColor(...colors.indigo);
    pdf.rect(0, 42, pageWidth, 2, 'F');

    // Logo & App Name
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text('TaskLite', margin, 24);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(203, 213, 225);
    pdf.text('Task Summary & Export Report', margin, 33);

    // Date Generated on Right Header
    pdf.setFontSize(9);
    pdf.setTextColor(148, 163, 184);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    pdf.text(`Export Date: ${dateStr}`, pageWidth - margin, 24, { align: 'right' });

    let currentY = 58;

    // 2. MAIN CARD CONTAINER
    pdf.setDrawColor(...colors.slateBorder);
    pdf.setFillColor(255, 255, 255);
    
    // Draw outer frame
    pdf.roundedRect(margin, currentY, contentWidth, pageHeight - currentY - 30, 4, 4, 'S');

    currentY += 14;

    // TASK TITLE SECTION
    pdf.setTextColor(...colors.textSecondary);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('TASK TITLE', margin + 10, currentY);

    currentY += 7;
    pdf.setTextColor(...colors.textPrimary);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    
    const titleLines = pdf.splitTextToSize(task.title || 'Untitled Task', contentWidth - 20);
    pdf.text(titleLines, margin + 10, currentY);
    currentY += (titleLines.length * 7) + 8;

    // HORIZONTAL DIVIDER
    pdf.setDrawColor(...colors.slateBorder);
    pdf.line(margin + 10, currentY, pageWidth - margin - 10, currentY);
    currentY += 12;

    // STATUS & PRIORITY BADGES ROW
    const drawBadge = (label, value, x, y, bgRgb) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.textSecondary);
      pdf.text(label, x, y);

      const textWidth = pdf.getTextWidth(value);
      const badgeWidth = Math.max(textWidth + 10, 24);
      const badgeHeight = 7;
      const badgeY = y + 3;

      pdf.setFillColor(...bgRgb);
      pdf.roundedRect(x, badgeY, badgeWidth, badgeHeight, 2, 2, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(value, x + (badgeWidth / 2), badgeY + 4.8, { align: 'center' });
    };

    // Get Status Color
    let statusBg = colors.slateSecondary;
    if (task.status === 'To Do') statusBg = colors.todo;
    else if (task.status === 'In Progress') statusBg = colors.inProgress;
    else if (task.status === 'Done') statusBg = colors.done;

    // Get Priority Color
    let priorityBg = colors.slateSecondary;
    if (task.priority === 'High') priorityBg = colors.high;
    else if (task.priority === 'Medium') priorityBg = colors.medium;
    else if (task.priority === 'Low') priorityBg = colors.low;

    drawBadge('STATUS', task.status || 'To Do', margin + 10, currentY, statusBg);
    drawBadge('PRIORITY', task.priority || 'Medium', margin + 70, currentY, priorityBg);

    // DUE DATE SECTION (3rd column)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.textSecondary);
    pdf.text('DUE DATE', margin + 130, currentY);

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(isOverdue ? colors.high[0] : colors.textPrimary[0], isOverdue ? colors.high[1] : colors.textPrimary[1], isOverdue ? colors.high[2] : colors.textPrimary[2]);
    pdf.text(formatDate(task.dueDate), margin + 130, currentY + 8);

    if (isOverdue) {
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.high);
      pdf.text('OVERDUE', margin + 130, currentY + 13);
    }

    currentY += 22;

    // HORIZONTAL DIVIDER
    pdf.setDrawColor(...colors.slateBorder);
    pdf.line(margin + 10, currentY, pageWidth - margin - 10, currentY);
    currentY += 12;

    // DESCRIPTION SECTION
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.textSecondary);
    pdf.text('DESCRIPTION', margin + 10, currentY);

    currentY += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.textPrimary);

    const descText = task.description && task.description.trim() ? task.description : 'No description provided for this task.';
    const descLines = pdf.splitTextToSize(descText, contentWidth - 30);

    // Light grey box for description background
    const descBoxHeight = Math.max((descLines.length * 5.5) + 10, 24);
    pdf.setFillColor(...colors.slateLight);
    pdf.setDrawColor(...colors.slateBorder);
    pdf.roundedRect(margin + 10, currentY, contentWidth - 20, descBoxHeight, 3, 3, 'FD');

    pdf.text(descLines, margin + 15, currentY + 8);
    currentY += descBoxHeight + 14;

    // METADATA (Created & Updated)
    if (task.createdAt || task.updatedAt) {
      pdf.setDrawColor(...colors.slateBorder);
      pdf.line(margin + 10, currentY, pageWidth - margin - 10, currentY);
      currentY += 10;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.textSecondary);

      if (task.createdAt) {
        pdf.text(`Created: ${formatDate(task.createdAt)}`, margin + 10, currentY);
      }
      if (task.updatedAt) {
        pdf.text(`Last Updated: ${formatDate(task.updatedAt)}`, margin + 100, currentY);
      }
    }

    // 3. FOOTER
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.textSecondary);
    pdf.text('TaskLite Workflow Management System — Confidential', pageWidth / 2, pageHeight - 12, { align: 'center' });

    // Save File
    const sanitizedTitle = (task.title || 'task').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    pdf.save(`task-${sanitizedTitle}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};