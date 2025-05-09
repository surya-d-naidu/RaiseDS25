import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminCommitteePage() {
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", position: "", category: "", order: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/committee")
      .then((res) => res.json())
      .then(setCommitteeMembers)
      .catch(() => toast({ title: "Error fetching committee members", variant: "destructive" }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `/api/committee/${formData.id}` : "/api/committee";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save committee member");
        return res.json();
      })
      .then((data) => {
        setCommitteeMembers((prev) =>
          formData.id
            ? prev.map((member) => (member.id === data.id ? data : member))
            : [...prev, data]
        );
        setIsDialogOpen(false);
        toast({ title: "Committee member saved successfully" });
      })
      .catch(() => toast({ title: "Error saving committee member", variant: "destructive" }));
  };

  const handleDelete = (id) => {
    fetch(`/api/committee/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete committee member");
        setCommitteeMembers((prev) => prev.filter((member) => member.id !== id));
        toast({ title: "Committee member deleted successfully" });
      })
      .catch(() => toast({ title: "Error deleting committee member", variant: "destructive" }));
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Committee Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsDialogOpen(true)}>Add Member</Button>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {committeeMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.category}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(member);
                        setIsDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Member" : "Add Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleInputChange}
            />
            <Input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
            />
            <Input
              name="order"
              placeholder="Order"
              type="number"
              value={formData.order}
              onChange={handleInputChange}
            />
          </div>
          <Button className="mt-4" onClick={handleSubmit}>
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}