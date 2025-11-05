import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Abstract, Author } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { InfoIcon, AlertTriangle, FileText, CheckCircle2, Clock, Plus, Trash2, X, Loader2 } from "lucide-react";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import AbstractForm from "@/components/forms/abstract-form";
import FullPaperUpload from "@/components/forms/full-paper-upload";
import { getCategoryCode } from "@/lib/abstract-utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AbstractSubmissionPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("submit");
  const [formData, setFormData] = useState({ 
    title: "", 
    category: "", 
    content: "", 
    keywords: "" 
  });
  const [authors, setAuthors] = useState<Author[]>([
    { name: "", affiliation: "", category: "Presenter", email: "" }
  ]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to count words in text
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const { data: abstracts, isLoading } = useQuery<Abstract[]>({
    queryKey: ["/api/abstracts"],
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/abstracts", formData);
      return await response.json();
    },
    onSuccess: () => {
      setShowSuccessMessage(true);
      toast({
        title: "Abstract Submitted",
        description: "Your abstract has been successfully submitted for review.",
      });
      setFormData({ title: "", category: "", content: "", keywords: "" });
      setAuthors([{ name: "", affiliation: "", category: "Presenter", email: "" }]);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      queryClient.invalidateQueries({ queryKey: ["/api/abstracts"] });
      
      // Hide success message after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your abstract. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Error submitting abstract:", error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAuthorChange = (index: number, field: keyof Author, value: string | boolean) => {
    setAuthors(prev => {
      const newAuthors = [...prev];
      
      // If changing category to "Presenter", ensure no other author is already a presenter
      if (field === 'category' && value === 'Presenter') {
        const currentPresenterIndex = newAuthors.findIndex((author, i) => i !== index && author.category === 'Presenter');
        if (currentPresenterIndex !== -1) {
          // Change the current presenter to participant
          newAuthors[currentPresenterIndex] = { ...newAuthors[currentPresenterIndex], category: 'Participant' };
        }
      }
      
      newAuthors[index] = { ...newAuthors[index], [field]: value };
      return newAuthors;
    });
  };
  
  const addAuthor = () => {
    setAuthors(prev => [...prev, { name: "", affiliation: "", category: "Participant", email: "" }]);
  };
  
  const removeAuthor = (index: number) => {
    if (authors.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one author is required",
        variant: "destructive",
      });
      return;
    }
    
    setAuthors(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for your abstract.",
        variant: "destructive",
      });
      return;
    }

    // Validate authors
    const invalidAuthorIndex = authors.findIndex(
      author => !author.name.trim() || !author.affiliation.trim() || !author.email.trim()
    );
    
    if (invalidAuthorIndex >= 0) {
      toast({
        title: "Incomplete Author Information",
        description: `Please provide name, affiliation, and email for author #${invalidAuthorIndex + 1}.`,
        variant: "destructive",
      });
      return;
    }

    // Validate presenter constraint
    const presenters = authors.filter(author => author.category === "Presenter");
    if (presenters.length === 0) {
      toast({
        title: "No Presenter Designated",
        description: "At least one author must be designated as the Presenter.",
        variant: "destructive",
      });
      return;
    }

    if (presenters.length > 1) {
      toast({
        title: "Multiple Presenters",
        description: "Only one author can be designated as the Presenter.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Missing Category",
        description: "Please select a category for your abstract.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide content for your abstract.",
        variant: "destructive",
      });
      return;
    }

    // Validate word count for abstract content
    const wordCount = countWords(formData.content);
    if (wordCount > 250) {
      toast({
        title: "Content Too Long",
        description: `Your abstract contains ${wordCount} words. Please limit it to 250 words.`,
        variant: "destructive",
      });
      return;
    }

    if (!formData.keywords.trim()) {
      toast({
        title: "Missing Keywords",
        description: "Please provide keywords for your abstract.",
        variant: "destructive",
      });
      return;
    }

    // Validate keywords count
    const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    if (keywordsArray.length > 5) {
      toast({
        title: "Too Many Keywords",
        description: `You provided ${keywordsArray.length} keywords. Please limit to 5 keywords maximum.`,
        variant: "destructive",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("authors", JSON.stringify(authors));
    formDataToSend.append("category", formData.category);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("keywords", formData.keywords);

    if (selectedFile) {
      formDataToSend.append("file", selectedFile);
    }

    submitMutation.mutate(formDataToSend);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Submit Abstract | RAISE DS 2025</title>
        <meta
          name="description"
          content="Submit your abstract for the 45th Annual Convention of Indian Society for Probability and Statistics (ISPS) and the International Conference on Recent Advances and Innovative Statistics with Enhancing Data Science (IC-RAISE DS)."
        />
      </Helmet>

      <Navbar />

      <main className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Abstract Submission
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Share your research with the statistical community
            </p>
          </div>

          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submit">Submit Abstract</TabsTrigger>
              <TabsTrigger value="my-abstracts">My Abstracts</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Your Abstract</CardTitle>
                      <CardDescription>
                        Please fill in all required fields to submit your abstract for review
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {showSuccessMessage ? (
                        <div className="text-center py-12">
                          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Abstract Submitted Successfully!
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Thank you for submitting your abstract. Your submission has been received and will be reviewed by our committee. You will receive a notification about the status within the review period.
                          </p>
                          <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center justify-center">
                              <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
                              <span>You can track your submission status in the "My Abstracts" tab</span>
                            </div>
                            <div className="flex items-center justify-center">
                              <Clock className="h-4 w-4 mr-2 text-amber-500" />
                              <span>Review results will be announced by November 10, 2025</span>
                            </div>
                          </div>
                          <div className="mt-8 space-x-4">
                            <button
                              onClick={() => setActiveTab("my-abstracts")}
                              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
                            >
                              View My Abstracts
                            </button>
                            <button
                              onClick={() => setShowSuccessMessage(false)}
                              className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200 transition-colors"
                            >
                              Submit Another Abstract
                            </button>
                          </div>
                        </div>
                      ) : (
                      <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                          <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Enter the title of your abstract"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Authors *</label>
                            <button 
                              type="button" 
                              onClick={addAuthor}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-primary bg-primary-50 hover:bg-primary-100"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Author
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">
                            <strong>Note:</strong> Exactly one author must be designated as the "Presenter". 
                            The presenter will be responsible for presenting the paper at the conference.
                          </p>
                          
                          {authors.map((author, index) => (
                            <div key={index} className={`border rounded-md p-4 relative ${
                              author.category === 'Presenter' 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-gray-50'
                            }`}>
                              {author.category === 'Presenter' && (
                                <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                  Presenter
                                </div>
                              )}
                              <div className="absolute top-2 right-2">
                                <button
                                  type="button"
                                  onClick={() => removeAuthor(index)}
                                  className="text-gray-400 hover:text-red-500 p-1"
                                  title="Remove author"
                                  disabled={authors.length <= 1}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full name (As per certificate) *
                                  </label>
                                  <input
                                    type="text"
                                    value={author.name}
                                    onChange={(e) => handleAuthorChange(index, 'name', e.target.value)}
                                    placeholder="Full name as per certificate"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Affiliation *
                                  </label>
                                  <input
                                    type="text"
                                    value={author.affiliation}
                                    onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                                    placeholder="Institution/University"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                  </label>
                                  <input
                                    type="email"
                                    value={author.email || ''}
                                    onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                                    placeholder="Email address"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                  </label>
                                  <select
                                    value={author.category}
                                    onChange={(e) => handleAuthorChange(index, 'category', e.target.value)}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                  >
                                    <option value="Delegate (Keynote speaker)">Delegate (Keynote speaker)</option>
                                    <option value="Delegate (Invited speaker)">Delegate</option>
                                    <option value="Presenter">Presenter</option>
                                    <option value="Participant">Other Authors</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange as any}
                            required
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="">Select Category</option>
                            {/* Alphabetically sorted categories */}
                            <option value="Actuarial Statistics">Actuarial Statistics</option>
                            <option value="Agricultural Statistics">Agricultural Statistics</option>
                            <option value="AI & Machine Learning">AI & Machine Learning</option>
                            <option value="Applied Mathematics">Applied Mathematics</option>
                            <option value="Applied Statistics">Applied Statistics</option>
                            <option value="Bayesian and Fuzzy Statistics">Bayesian and Fuzzy Statistics</option>
                            <option value="Bio-Statistics">Bio-Statistics</option>
                            <option value="Data Science Techniques">Data Science Techniques</option>
                            <option value="Distribution Theory">Distribution Theory</option>
                            <option value="Econometrics">Econometrics</option>
                            <option value="Environmental Statistics">Environmental Statistics</option>
                            <option value="Mathematical Modelling">Mathematical Modelling</option>
                            <option value="Multi-Disciplinary Research">Multi-Disciplinary Research</option>
                            <option value="Multivariate Analysis">Multivariate Analysis</option>
                            <option value="Official Statistics">Official Statistics</option>
                            <option value="Operations Research">Operations Research</option>
                            <option value="Planning and Experimental Designs">Planning and Experimental Designs</option>
                            <option value="Population Studies">Population Studies</option>
                            <option value="Probability Theory">Probability Theory</option>
                            <option value="Reliability and Survival Analysis">Reliability and Survival Analysis</option>
                            <option value="Spatial Statistics">Spatial Statistics</option>
                            <option value="Statistical Inference">Statistical Inference</option>
                            <option value="Statistical Quality Control">Statistical Quality Control</option>
                            <option value="Statistics in Management">Statistics in Management</option>
                            <option value="Stochastic Modelling">Stochastic Modelling</option>
                            <option value="Survey Sampling">Survey Sampling</option>
                            <option value="Time Series Analysis">Time Series Analysis</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">Keywords * <span className="text-xs text-gray-500">(Comma separated, max 5)</span></label>
                          <input
                            id="keywords"
                            type="text"
                            name="keywords"
                            placeholder="e.g., statistics, probability, data science"
                            value={formData.keywords}
                            onChange={handleInputChange}
                            required
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Abstract Content * 
                            <span className="text-xs text-gray-500 ml-2">
                              (Markdown and LaTeX supported. Use $...$ for inline math and $$...$$ for display math)
                            </span>
                          </label>
                          <div className="relative">
                            <textarea
                              id="content"
                              name="content"
                              rows={10}
                              placeholder="Enter your abstract content here..."
                              value={formData.content}
                              onChange={handleInputChange}
                              required
                              className="w-full border rounded px-3 py-2 font-mono"
                            />
                            <div className={`text-xs mt-1 ${
                              countWords(formData.content) > 250 
                                ? 'text-red-500 font-medium' 
                                : countWords(formData.content) > 200 
                                  ? 'text-amber-500' 
                                  : 'text-gray-500'
                            }`}>
                              Word count: {countWords(formData.content)}/250
                              {countWords(formData.content) > 250 && (
                                <span className="ml-2 font-medium">⚠️ Exceeds limit</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                            Supporting Document <span className="text-xs text-gray-500">(Optional, DOCX only, max 5MB)</span>
                          </label>
                          <input
                            id="file"
                            type="file"
                            accept=".docx"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        
                        <div className="pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
                          <div className="border rounded p-4 bg-white max-h-96 overflow-y-auto">
                            {formData.title || authors.some(a => a.name.trim()) || formData.content ? (
                              <div className="space-y-4">
                                {/* Title */}
                                {formData.title && (
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                      <MarkdownRenderer content={formData.title} />
                                    </div>
                                  </div>
                                )}
                                
                                {/* Authors with superscript affiliation indices */}
                                {authors.some(a => a.name.trim()) && (
                                  <div className="text-center">
                                    <div className="text-sm text-gray-800 mb-2">
                                      {(() => {
                                        // Get unique affiliations and create index mapping
                                        const affiliations = authors.filter(a => a.affiliation.trim()).map(a => a.affiliation);
                                        const uniqueAffiliations = affiliations.filter((value, index, self) => self.indexOf(value) === index);
                                        const affiliationToIndex = Object.fromEntries(
                                          uniqueAffiliations.map((affiliation, index) => [affiliation, index + 1])
                                        );
                                        
                                        return (
                                          <>
                                            {/* Author names with superscript indices */}
                                            <div className="mb-3">
                                              {authors
                                                .filter(a => a.name.trim())
                                                .map((author, index) => (
                                                  <span key={index}>
                                                    {index > 0 && ", "}
                                                    {author.name}
                                                    {author.affiliation.trim() && (
                                                      <sup className="text-xs">
                                                        {affiliationToIndex[author.affiliation]}
                                                      </sup>
                                                    )}
                                                  </span>
                                                ))
                                              }
                                            </div>
                                            
                                            {/* Affiliation list */}
                                            <div className="text-xs text-gray-600 space-y-1">
                                              {uniqueAffiliations.map((affiliation, index) => (
                                                <div key={index}>
                                                  <sup>{index + 1}</sup> {affiliation}
                                                </div>
                                              ))}
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Abstract content */}
                                {formData.content && (
                                  <div className="pt-3 border-t border-gray-200">
                                    <MarkdownRenderer content={formData.content} />
                                  </div>
                                )}
                                
                                {/* Keywords */}
                                {formData.keywords && (
                                  <div className="pt-3 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Keywords:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {formData.keywords.split(',').map((keyword, index) => (
                                        <span
                                          key={index}
                                          className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium"
                                        >
                                          {keyword.trim()}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-400 italic">Preview will appear here...</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={submitMutation.isPending}
                            className="w-full bg-primary text-white font-medium py-2 px-4 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                          >
                            {submitMutation.isPending ? (
                              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                            ) : (
                              "Submit Abstract"
                            )}
                          </button>
                        </div>
                      </form>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <InfoIcon className="mr-2 h-5 w-5 text-primary" />
                        Important Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Submission Deadline</p>
                            <p className="text-gray-600">November 01, 2025</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Acceptance Notification</p>
                            <p className="text-gray-600">November 10, 2025</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Abstract Format</p>
                            <p className="text-gray-600">
                              Maximum 250 words, DOCX format for supporting documents, including research problem, methodology, results, and conclusions
                            </p>
                          </div>
                        </div>
                      </div>

                      <Alert className="mt-6" variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Important Note</AlertTitle>
                        <AlertDescription>
                          At least one author must register for the conference to present the paper. Abstract submissions without subsequent registration will not be included in the conference program.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        Abstract Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        After submission, your abstract will go through a review process. You can check the status of your abstract in the "My Abstracts" tab.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                          <p>
                            <span className="font-medium">Pending:</span> Abstract is under review
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <p>
                            <span className="font-medium">Accepted:</span> Abstract has been accepted
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <p>
                            <span className="font-medium">Rejected:</span> Abstract has been rejected
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="my-abstracts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Submitted Abstracts</CardTitle>
                  <CardDescription>
                    View and manage your submitted abstracts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="spinner h-8 w-8 mx-auto mb-4 border-4 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-gray-600">Loading your abstracts...</p>
                    </div>
                  ) : abstracts && abstracts.length > 0 ? (
                    <div className="space-y-6">
                      {abstracts.map((abstract) => (
                        <div key={abstract.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                            <div>
                              <h3 className="font-medium text-gray-900">{abstract.title}</h3>
                              <div className="text-xs text-gray-500 mt-1">
                                ID: {abstract.referenceId || `${getCategoryCode(abstract.category)}-${abstract.id.toString().padStart(4, '0')}`}
                              </div>
                            </div>
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                abstract.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : abstract.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {abstract.status.charAt(0).toUpperCase() + abstract.status.slice(1)}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-500">Category:</span>
                              <span className="ml-2 text-sm text-gray-900">{abstract.category}</span>
                            </div>
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-500">Keywords:</span>
                              <span className="ml-2 text-sm text-gray-900">{abstract.keywords}</span>
                            </div>
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-500">Submitted:</span>
                              <span className="ml-2 text-sm text-gray-900">
                                {abstract.createdAt ? new Date(abstract.createdAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <h4 className="text-sm font-medium text-gray-500">Abstract:</h4>
                              <p className="text-sm text-gray-900 mt-1">{abstract.content}</p>
                            </div>
                            {abstract.fileUrl && (
                              <div className="mt-4">
                                <a
                                  href={abstract.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
                                >
                                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                                  View Uploaded File
                                </a>
                              </div>
                            )}
                            {abstract.status === "accepted" && (
                              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="text-sm font-medium text-green-800 mb-2">
                                  Full-Length Paper Submission
                                </h4>
                                <p className="text-sm text-green-700 mb-3">
                                  Your abstract has been accepted! You can now upload your full-length paper.
                                </p>
                                {abstract.fullPaperUrl ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <a
                                        href={`/api/abstracts/${abstract.id}/full-paper`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                                      >
                                        <FileText className="mr-1.5 h-3.5 w-3.5" />
                                        View Full Paper
                                      </a>
                                      <span className="text-xs text-green-600">✓ Full paper uploaded</span>
                                    </div>
                                    <FullPaperUpload abstractId={abstract.id} isReplacement={true} />
                                  </div>
                                ) : (
                                  <FullPaperUpload abstractId={abstract.id} isReplacement={false} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No abstracts submitted yet</h3>
                      <p className="text-gray-500 mb-4">
                        You haven't submitted any abstracts for the conference
                      </p>
                      <button
                        onClick={() => {
                          const submitTab = document.querySelector('[data-value="submit"]') as HTMLElement;
                          submitTab?.click();
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Submit an Abstract
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guidelines" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Abstract Submission Guidelines</CardTitle>
                  <CardDescription>
                    Please follow these guidelines when preparing and submitting your abstract
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-indigo max-w-none">
                    <h3>Abstract Format</h3>
                    <ul>
                      <li>Abstracts should be 300-500 words in length.</li>
                      <li>Abstracts must be written in English.</li>
                      <li>Use a clear and concise writing style.</li>
                      <li>Include 3-5 keywords that best represent the content of your research.</li>
                      <li>
                        Full papers (if required after abstract acceptance) should be formatted according to the conference
                        template, not exceeding 10 pages including references.
                      </li>
                    </ul>

                    <h3>Abstract Structure</h3>
                    <p>Your abstract should clearly describe:</p>
                    <ul>
                      <li>
                        <strong>Research Problem:</strong> Clearly state the problem addressed in your research and its
                        significance.
                      </li>
                      <li>
                        <strong>Methodology:</strong> Briefly describe the methods, techniques, or approach used in your
                        research.
                      </li>
                      <li>
                        <strong>Results:</strong> Summarize the main findings or outcomes of your research.
                      </li>
                      <li>
                        <strong>Conclusions:</strong> State the implications and significance of your findings.
                      </li>
                    </ul>

                    <Separator className="my-6" />

                    <h3>Review Process</h3>
                    <p>All submissions will undergo a double-blind peer review process. Abstracts will be evaluated based on:</p>
                    <ul>
                      <li>Originality and innovation</li>
                      <li>Relevance to the conference themes</li>
                      <li>Methodological soundness</li>
                      <li>Clarity of presentation</li>
                      <li>Potential impact and contribution to the field</li>
                    </ul>

                    <h3>Presentation Types</h3>
                    <p>Based on the review results, accepted abstracts will be assigned to:</p>
                    <ul>
                      <li>
                        <strong>Oral Presentation:</strong> 15-20 minutes presentation followed by 5 minutes for questions and
                        discussion.
                      </li>
                      <li>
                        <strong>Poster Presentation:</strong> Interactive session where authors can discuss their research with
                        interested attendees.
                      </li>
                    </ul>
                    <p>
                      Authors may indicate their preference for presentation type, but the final decision rests with the
                      scientific committee.
                    </p>

                    <Separator className="my-6" />

                    <h3>Publication Opportunities</h3>
                    <p>
                      Selected papers will be considered for publication in partner journals and conference proceedings. Authors
                      of accepted abstracts will receive detailed information about the publication process after notification of
                      acceptance.
                    </p>

                    <Alert className="mt-6">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Important Note</AlertTitle>
                      <AlertDescription>
                        At least one author of each accepted abstract must register for the conference and present the work.
                        Abstracts without a registered presenter will not be included in the final program.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
}
