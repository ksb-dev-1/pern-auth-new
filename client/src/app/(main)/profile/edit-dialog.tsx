"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { SquarePen, X } from "lucide-react";

import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/hooks/useProfile";

interface EditProfileProps {
  currentName: string;
  currentImageUrl: string | undefined;
}

export function EditProfile({
  currentName,
  currentImageUrl,
}: EditProfileProps) {
  const [name, setName] = useState(currentName);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dialogKey, setDialogKey] = useState(0);
  const [open, setOpen] = useState(false);

  const updateProfile = useUpdateProfile();

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetDialog = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setName(currentName);
    setSelectedFile(null);
    setPreviewUrl(null);
    setDialogKey((prev) => prev + 1);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      resetDialog();
    }

    setOpen(newOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Remove previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  };

  const removeSelectedImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasChanges = name !== currentName || selectedFile !== null;

    if (!hasChanges) {
      setOpen(false);
      return;
    }

    const updateData: {
      name?: string;
      image?: File;
    } = {};

    if (name !== currentName) {
      updateData.name = name;
    }

    if (selectedFile) {
      updateData.image = selectedFile;
    }

    await updateProfile.mutateAsync(updateData);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setSelectedFile(null);
    setOpen(false);
  };

  const isPending = updateProfile.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 gap-2 shrink-0"
        >
          <SquarePen className="h-3.5 w-3.5" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent key={dialogKey} className="sm:max-w-sm!">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Edit Profile</DialogTitle>

          <DialogDescription>
            Update your name or profile picture.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-muted">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <>
                    <AvatarImage
                      src={currentImageUrl || ""}
                      alt={currentName}
                    />
                    <AvatarFallback className="text-2xl font-bold">
                      {currentName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>

              {previewUrl && (
                <Button
                  type="button"
                  size="icon"
                  className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-red-600 text-white hover:bg-red-400"
                  onClick={removeSelectedImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <Label
              htmlFor="image-upload"
              className="cursor-pointer text-sm text-brand hover:underline"
            >
              {selectedFile ? "Change Image" : "Select Image"}
            </Label>

            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>

              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isPending}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-brand text-white hover:bg-brand-hover dark:text-background"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  Saving <Spinner />
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
