import jsPDF from 'jspdf';

export const generateTaskPDF = (task) => {
  try {
    const pdf = new jsPDF();
    
    // Set up colors
    const primaryColor = [41, 98, 255]; // Blue
    const secondaryColor = [75, 85, 99]; // Gray
    const accentColor = {
      High: [239, 68, 68], // Red
      Medium: [245, 158, 11], // Yellow
      Low: [34, 197, 94] // Green
    };

    // Helper function to format date
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return 'Invalid Date';
      }
    };

    // Header
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, 210, 40, 'F');
    
    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.text('TaskLite', 20, 25);
    
    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Task Details Report', 20, 35);

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    // Task Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('Task Information', 20, 60);

    // Draw a line under the header
    pdf.setDrawColor(...secondaryColor);
    pdf.setLineWidth(0.5);
    pdf.line(20, 65, 190, 65);

    let currentY = 80;

    // Task Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Title:', 20, currentY);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    
    // Handle long titles with text wrapping
    const titleLines = pdf.splitTextToSize(task.title, 120);
    pdf.text(titleLines, 50, currentY);
    currentY += titleLines.length * 6 + 5;

    // Task Description
    if (task.description) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Description:', 20, currentY);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      
      const descLines = pdf.splitTextToSize(task.description, 150);
      pdf.text(descLines, 20, currentY + 10);
      currentY += descLines.length * 6 + 20;
    } else {
      currentY += 10;
    }

    // Status Box
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Status:', 20, currentY);
    
    // Status badge
    let statusColor;
    switch (task.status) {
      case 'To Do':
        statusColor = [251, 146, 60]; // Orange
        break;
      case 'In Progress':
        statusColor = [59, 130, 246]; // Blue
        break;
      case 'Done':
        statusColor = [34, 197, 94]; // Green
        break;
      default:
        statusColor = [156, 163, 175]; // Gray
    }
    
    pdf.setFillColor(...statusColor);
    pdf.roundedRect(50, currentY - 6, 30, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(task.status, 52, currentY);
    pdf.setTextColor(0, 0, 0);
    
    currentY += 20;

    // Priority
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Priority:', 20, currentY);
    
    // Priority badge
    const priorityColor = accentColor[task.priority] || [156, 163, 175];
    pdf.setFillColor(...priorityColor);
    pdf.roundedRect(50, currentY - 6, 25, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(task.priority, 52, currentY);
    pdf.setTextColor(0, 0, 0);
    
    currentY += 20;

    // Due Date
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Due Date:', 20, currentY);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(formatDate(task.dueDate), 50, currentY);
    
    currentY += 20;

    // Check if overdue
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
    if (isOverdue) {
      pdf.setTextColor(239, 68, 68);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('⚠ This task is overdue!', 20, currentY);
      pdf.setTextColor(0, 0, 0);
      currentY += 15;
    }

    // Created Date
    if (task.createdAt) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Created:', 20, currentY);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text(formatDate(task.createdAt), 50, currentY);
      currentY += 15;
    }

    // Updated Date
    if (task.updatedAt && task.updatedAt !== task.createdAt) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Last Updated:', 20, currentY);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text(formatDate(task.updatedAt), 50, currentY);
      currentY += 15;
    }

    // Footer
    const pageHeight = pdf.internal.pageSize.height;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);
    pdf.text('Generated by TaskLite', 20, pageHeight - 20);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, pageHeight - 10);

    // Add a border around the content
    pdf.setDrawColor(...secondaryColor);
    pdf.setLineWidth(1);
    pdf.rect(15, 45, 180, pageHeight - 80, 'S');

    // Save the PDF
    const filename = `task-${task.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};