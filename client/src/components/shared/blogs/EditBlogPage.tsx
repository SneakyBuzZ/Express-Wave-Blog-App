import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useThemeStore from "@/lib/store/themeStore";
import { ImageDown } from "lucide-react";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { EditBlogSchema } from "@/lib/validation";
import {
  useEditBlogQuery,
  useGetBlogsBySlug,
  useUploadBlogImageFileQuery,
} from "@/lib/react-query/queriesAndMutation";
import { useNavigate, useParams } from "react-router-dom";
import { EditBlogType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/store/userStore";

export type EditBlogPageType = {
  title: string;
  description: string;
  content: string;
  image: string;
};

function EditBlogPage() {
  const { slug } = useParams();
  const [color, setColor] = useState("#DFDFDF");
  const { theme } = useThemeStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === "dark") {
      setColor("#DFDFDF");
    } else if (theme === "light") {
      setColor("#212121");
    }
  }, [theme]);

  const [blogId, setBlogId] = useState<string>("");

  const { mutateAsync: getBlogBySlug } = useGetBlogsBySlug();
  useEffect(() => {
    getBlogBySlug(slug ? slug : "").then((response) => {
      if (response) {
        form.setValue("title", response.title);
        form.setValue("description", response.description);
        form.setValue("content", response.content);
        setImageFile(response.imageFile);
        setBlogId(response._id);
      }
    });
  }, []);

  const { mutateAsync: uploadBlogImageFile, isPending: isLoading } =
    useUploadBlogImageFileQuery();

  const [imageFile, setImageFile] = useState<string>("");
  async function handleImageInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("imageFile", e.target.files[0]);
      const imageUrl = await uploadBlogImageFile(formData);
      setImageFile(imageUrl);
    }
  }

  const form = useForm<z.infer<typeof EditBlogSchema>>({
    resolver: zodResolver(EditBlogSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
    },
  });

  const { mutateAsync: editBlog, isPending: isEditLoading } =
    useEditBlogQuery();

  const useStore = useUserStore();

  async function onSubmit(values: z.infer<typeof EditBlogSchema>) {
    const editedBlog: EditBlogType = {
      title: values.title,
      description: values.description,
      content: values.content,
      imageFile: imageFile,
      _id: blogId,
    };

    const editingDone = await editBlog(editedBlog);
    if (!editingDone) {
      toast({
        description: "Something went wrong",
        className: "text-red-400",
      });

      navigate("/");
    }

    navigate(`/profile/${useStore.user.username}`);

    toast({
      description: "Post edited successfully",
      className: "text-green-400",
    });
  }
  return (
    <>
      <section className="flex flex-col justify-center items-center w-full px-20">
        <div className="w-full py-5 flex items-center px-6">
          <div className="flex flex-col justify-center items-center w-full">
            <h1 className="text-heading font-freeman text-3xl mx-auto text-center">
              Edit Post
            </h1>
            <p className="text-content w-full text-center">
              Would you like to make any edits to your post before submitting?
              Just remember to save your changes when you're finished.
            </p>
          </div>
          <div className="h-full">
            <Button
              onClick={() => navigate(`/profile/${useStore.user?.username}`)}
              className=" self-end w-24"
              variant="yellow"
            >
              Back
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-full mb-10 ">
          <div className="h-full w-2/3">
            <div className="relative  h-[31rem] py-5 px-10">
              <input
                id="image-123"
                className="peer hidden"
                accept=".gif,.jpg,.png,.jpeg"
                type="file"
                multiple
                onInput={handleImageInput}
              />

              {isLoading ? (
                <>
                  <div className="flex h-full ex-input cursor-pointer flex-col justify-center items-center gap-6 rounded-lg px-6 py-10 text-center">
                    <h1>Image is uploading</h1>
                    <span className="loading loading-dots loading-md bg-yellow-500 scale-150"></span>
                  </div>
                </>
              ) : (
                <>
                  {imageFile ? (
                    <>
                      <label htmlFor="image-123">
                        <img
                          alt="gallery"
                          className="w-full h-full object-cover rounded-lg shadow-md  object-center block"
                          src={imageFile}
                        />
                      </label>
                    </>
                  ) : (
                    <label
                      htmlFor="image-123"
                      className="flex h-full ex-input cursor-pointer flex-col justify-center items-center gap-6 rounded-lg px-6 py-10 text-center"
                    >
                      <ImageDown color={color} strokeWidth={0.75} size={150} />
                      <p className="flex flex-col items-center justify-center gap-1 text-sm">
                        <span className="text-amber-400 hover:text-amber-400">
                          Upload media
                          <span className="text-content">
                            {" "}
                            or drag and drop{" "}
                          </span>
                        </span>
                        <span className="text-heading">
                          {" "}
                          PNG, JPG or GIF up to 10MB{" "}
                        </span>
                        {isLoading && (
                          <>
                            <span className="text-content">
                              File is uploading
                            </span>
                            <span className="loading loading-dots loading-md bg-yellow-500"></span>
                          </>
                        )}
                      </p>
                    </label>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-1/2 h-full px-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-3"
                encType="multipart/form-data"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="title"
                          className="ex-input"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="describe your blog briefly..."
                          className="ex-input placeholder:text-neutral-400 min-h-[30px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="write something about your blog..."
                          className="ex-input placeholder:text-neutral-400 min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" variant="yellow">
                  {isEditLoading ? (
                    <>
                      <span className="loading loading-spinner text-warning"></span>
                    </>
                  ) : (
                    "Edit"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditBlogPage;
