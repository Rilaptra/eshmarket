"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Plus,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { LoadingAnimation } from "@/components/loading-animation";
import { showToast } from "@/components/toast";

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: {
    dl: number;
    money: number;
  };

  showcaseLink: string;
  content: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/products");
        const data = await response.json();
        console.log("Data fetched:", data);
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: IProduct) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (editingProduct) {
      try {
        const response = await fetch(`/api/product/${editingProduct._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        });
        if (response.ok) {
          setProducts(
            products.map((p) =>
              p._id === editingProduct._id ? editingProduct : p
            )
          );
          setIsEditDialogOpen(false);
          showToast(true, "Product Updated!");
        } else {
          showToast(false, "Failed to update product");
          console.error("Failed to update product");
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await fetch(`/api/product/${productToDelete}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setProducts(products.filter((p) => p._id !== productToDelete));
          setIsDeleteDialogOpen(false);
          showToast(true, `Product Deleted!`);
        } else {
          showToast(false, "Failed to delete product");
          console.error("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setEditingProduct({ ...editingProduct, content });
      };
      reader.readAsText(file);
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(products) ? (
          products.map((product) => (
            <Card
              key={product._id}
              id={`product-${product._id}`}
              className="flex flex-col"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {product.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(product._id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-2 flex justify-between text-sm">
                  <span>DL: {product.price.dl}</span>
                  <span>Money: ${product.price.money}</span>
                </div>
                {product.showcaseLink && (
                  <div className="mt-4">
                    <iframe
                      width="100%"
                      height="200"
                      src={product.showcaseLink}
                      title={`${product.title} showcase`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    const blob = new Blob(
                      [product.content.slice(0, 1024 * 2)],
                      {
                        type: "text/plain",
                      }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${product.title}.lua`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div>No products available</div>
        )}
        {/* New Product Card */}
        <Link href="/product/add">
          <Card className="flex flex-col h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <Plus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600">
                  Add New Product
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  Click to create a new product
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5" />
              Edit Product
            </DialogTitle>
            <DialogDescription>
              Make changes to the product here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3 resize-none"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dl" className="text-right">
                  DL Price
                </Label>
                <Input
                  id="dl"
                  type="number"
                  value={editingProduct.price.dl}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: {
                        ...editingProduct.price,
                        dl: Number(e.target.value),
                      },
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="money" className="text-right">
                  Money Price
                </Label>
                <Input
                  id="money"
                  type="number"
                  value={editingProduct.price.money}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: {
                        ...editingProduct.price,
                        money: Number(e.target.value),
                      },
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="showcaseLink" className="text-right">
                  Showcase Link
                </Label>
                <Input
                  id="showcaseLink"
                  value={editingProduct.showcaseLink}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      showcaseLink: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="content"
                    value={editingProduct.content}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        content: e.target.value,
                      })
                    }
                    className="h-32 resize-none"
                  />
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".lua"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
