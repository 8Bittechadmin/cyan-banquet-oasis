
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ExportData from './ExportData';

interface ExportButtonProps {
  data: any[];
  filename: string;
  fileType?: 'excel' | 'pdf';
  label?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  filename, 
  fileType = 'excel',
  label
}) => {
  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: 'Export failed',
        description: 'There is no data to export.',
        variant: 'destructive',
      });
      return;
    }

    const exportComponent = new ExportData({ data, filename, fileType });
    exportComponent.exportToExcel();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className="flex items-center gap-1"
    >
      {fileType === 'excel' ? (
        <Download className="h-4 w-4 mr-1" />
      ) : (
        <FileText className="h-4 w-4 mr-1" />
      )}
      {label || `Export ${fileType.toUpperCase()}`}
    </Button>
  );
};

export default ExportButton;
