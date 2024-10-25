"use client";

import { format } from "date-fns";
import { useState, useEffect } from "react";

import { LoadingAnimation } from "@/components/loading-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface IDonation {
  _id: string;
  transactionId: string;
  supporterName: string;
  amount: number;
  createdAt: Date;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<IDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof IDonation; direction: "asc" | "desc" }>({ key: "createdAt", direction: "desc" });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/transactions");
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleSort = (key: keyof IDonation) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredTransactions = sortedTransactions.filter(
    (transaction) =>
      transaction.supporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <LoadingAnimation />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Transaction History</h1>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by supporter name or transaction ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("transactionId")} className="cursor-pointer">
                Transaction ID {sortConfig.key === "transactionId" && (sortConfig.direction === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead onClick={() => handleSort("supporterName")} className="cursor-pointer">
                Supporter Name {sortConfig.key === "supporterName" && (sortConfig.direction === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
                Amount {sortConfig.key === "amount" && (sortConfig.direction === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead onClick={() => handleSort("createdAt")} className="cursor-pointer">
                Date {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "▲" : "▼")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction.transactionId}</TableCell>
                <TableCell>{transaction.supporterName}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{format(new Date(transaction.createdAt), "PPP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredTransactions.length === 0 && (
        <p className="text-center mt-4">No transactions found.</p>
      )}
    </div>
  );
}