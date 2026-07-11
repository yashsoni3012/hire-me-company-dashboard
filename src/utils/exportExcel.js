import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function exportToExcel(data, filename, format = 'xlsx') {
    if (!data || data.length === 0) {
        console.warn('No data to export')
        return
    }

    try {
        if (format === 'pdf') {
            exportToPDF(data, filename)
        } else {
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.json_to_sheet(data)
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

            if (format === 'csv') {
                XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' })
            } else {
                XLSX.writeFile(wb, `${filename}.xlsx`)
            }
        }
    } catch (error) {
        console.error('Export error:', error)
        throw new Error(`Failed to export: ${error.message}`)
    }
}

export function exportToPDF(data, filename) {
    try {
        // Create new PDF document with better formatting
        const doc = new jsPDF('landscape', 'pt', 'a4')

        // Add title
        doc.setFontSize(22)
        doc.setTextColor(140, 87, 255)
        doc.text(filename.replace(/_/g, ' ').toUpperCase(), 40, 50)

        // Add timestamp
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 70)
        doc.text(`Total Records: ${data.length}`, 40, 85)

        // Add separator line
        doc.setDrawColor(140, 87, 255)
        doc.setLineWidth(1)
        doc.line(40, 95, doc.internal.pageSize.width - 40, 95)

        // Get headers
        const headers = Object.keys(data[0] || {})

        // Format rows
        const rows = data.map(item => headers.map(key => {
            let value = item[key] || ''
            // Handle special formatting
            if (typeof value === 'string' && value.includes('₹')) {
                return value
            }
            return String(value)
        }))

        // Add table with better styling
        doc.autoTable({
            head: [headers.map(h => h.toUpperCase())],
            body: rows,
            startY: 105,
            margin: { left: 40, right: 40 },
            styles: {
                fontSize: 9,
                cellPadding: 6,
                lineColor: [200, 200, 200],
                lineWidth: 0.5,
                valign: 'middle',
            },
            headStyles: {
                fillColor: [140, 87, 255],
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center',
            },
            bodyStyles: {
                textColor: [50, 50, 50],
            },
            alternateRowStyles: {
                fillColor: [248, 247, 250],
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
            },
            didParseCell: function (data) {
                // Highlight status cells
                const headers = data.table.head[0]
                if (headers && headers.length > 0) {
                    const statusIndex = headers.findIndex(h =>
                        h.raw && h.raw.toLowerCase().includes('status')
                    )
                    if (data.column.index === statusIndex && data.cell.raw) {
                        const status = String(data.cell.raw).toLowerCase()
                        if (status === 'active') {
                            data.cell.styles = { textColor: [0, 180, 60] }
                        } else if (status === 'pending') {
                            data.cell.styles = { textColor: [255, 180, 0] }
                        } else if (status === 'closed' || status === 'rejected') {
                            data.cell.styles = { textColor: [220, 50, 50] }
                        }
                    }
                }
            },
        })

        // Save the PDF
        doc.save(`${filename}.pdf`)

    } catch (error) {
        console.error('PDF export error:', error)
        throw new Error(`Failed to export PDF: ${error.message}`)
    }
}