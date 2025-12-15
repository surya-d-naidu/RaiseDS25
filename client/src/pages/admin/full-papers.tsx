import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Filter,
  ExternalLink
} from "lucide-react";
import { Abstract, Author } from "@shared/schema";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { safeRenderAuthors, safeRenderAuthorsDetailed } from "@/lib/author-utils";

interface FullPaper extends Abstract {
  fullPaperUrl: string;
}

export default function AdminFullPapers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPaper, setSelectedPaper] = useState<FullPaper | null>(null);
  const [showPaperDialog, setShowPaperDialog] = useState(false);

  const { data: abstracts, isLoading } = useQuery<Abstract[]>({
    queryKey: ["/api/admin/abstracts"],
  });

  // Filter abstracts to only include those with full papers uploaded
  const fullPapers = abstracts?.filter(abstract => 
    abstract.fullPaperUrl && abstract.fullPaperUrl.trim() !== ""
  ) as FullPaper[] || [];

  // Apply filters
  const filteredPapers = fullPapers.filter(paper => {
    const authorsText = safeRenderAuthorsDetailed(paper.authors);
    
    const matchesSearch = searchTerm === "" || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      authorsText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.referenceId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || paper.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || paper.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(fullPapers.map(paper => paper.category)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportData = () => {
    const csvData = [
      ['Reference ID', 'Title', 'Authors', 'Category', 'Status', 'Submitted Date', 'Full Paper URL'],
      ...filteredPapers.map(paper => [
        paper.referenceId || '',
        paper.title,
        safeRenderAuthorsDetailed(paper.authors),
        paper.category,
        paper.status,
        new Date(paper.createdAt).toLocaleDateString(),
        paper.fullPaperUrl
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `full-papers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPaper = (url: string) => {
    window.open(url, '_blank');
  };

  const viewPaperDetails = (paper: FullPaper) => {
    setSelectedPaper(paper);
    setShowPaperDialog(true);
  };

  return (
    <AdminLayout 
      title="Full Papers Management" 
      description="View and manage submitted full-length papers"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Full Papers</p>
                <p className="text-3xl font-bold text-gray-900">{fullPapers.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Accepted Papers</p>
                <p className="text-3xl font-bold text-green-600">
                  {fullPapers.filter(p => p.status === 'accepted').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Under Review</p>
                <p className="text-3xl font-bold text-blue-600">
                  {fullPapers.filter(p => p.status === 'under_review').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
              </div>
              <Filter className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Full Papers</span>
            <Button onClick={exportData} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search papers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              {filteredPapers.length} of {fullPapers.length} papers
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Papers Table */}
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading full papers...</p>
            </div>
          ) : filteredPapers.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No full papers found</h3>
              <p className="text-gray-500">
                {fullPapers.length === 0 
                  ? "No full papers have been submitted yet" 
                  : "No papers match your current filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Authors</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPapers.map((paper) => (
                    <TableRow key={paper.id}>
                      <TableCell className="font-medium">
                        {paper.referenceId}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={paper.title}>
                          {paper.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={safeRenderAuthorsDetailed(paper.authors)}>
                          {safeRenderAuthors(paper.authors)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate text-sm" title={paper.category}>
                          {paper.category}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(paper.status)}>
                          {paper.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(paper.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewPaperDetails(paper)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPaper(paper.fullPaperUrl)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paper Details Dialog */}
      <Dialog open={showPaperDialog} onOpenChange={setShowPaperDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Full Paper Details</DialogTitle>
            <DialogDescription>
              {selectedPaper?.referenceId} - {selectedPaper?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPaper && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Authors</h4>
                  <div className="text-gray-600">
                    {Array.isArray(selectedPaper.authors) ? (
                      <div className="space-y-1">
                        {selectedPaper.authors.map((author, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium">{author.name}</span>
                            <span className="text-gray-500"> - {author.affiliation}</span>
                            <span className="text-xs text-blue-600 ml-2">({author.category})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>{typeof selectedPaper.authors === 'string' ? selectedPaper.authors : 'No author information'}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Category</h4>
                  <p className="text-gray-600">{selectedPaper.category}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Status</h4>
                  <Badge className={getStatusColor(selectedPaper.status)}>
                    {selectedPaper.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Submitted</h4>
                  <p className="text-gray-600">
                    {new Date(selectedPaper.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Abstract</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <MarkdownRenderer content={selectedPaper.content} />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Full Paper</h4>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => openPaper(selectedPaper.fullPaperUrl)}
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open Full Paper</span>
                  </Button>
                  <p className="text-sm text-gray-500">
                    Click to view the submitted full-length paper
                  </p>
                </div>
              </div>

              {selectedPaper.keywords && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Keywords</h4>
                  <p className="text-gray-600">{selectedPaper.keywords}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
