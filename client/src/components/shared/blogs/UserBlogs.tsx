import { Button } from "@/components/ui/button";
// import BlogCard from "./BlogCard";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import useUserStore from "@/lib/store/userStore";
import { useGetUserBlogs } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AllBlogsType } from "@/lib/types";
import BlogCard from "./BlogCard";
import PostSkeleton from "../small/PostSkeleton";
import { MailWarning } from "lucide-react";

function UserBlogs() {
  const navigate = useNavigate();
  const { isUserLoggedIn } = useUserStore();
  const { toast } = useToast();
  const { mutateAsync: getUserBlogs, isPending: isLoading } = useGetUserBlogs();

  const [userBlogs, setUserBlogs] = useState<AllBlogsType[]>([]);

  useEffect(() => {
    getUserBlogs()
      .then((response) => {
        setUserBlogs(response);
      })
      .catch((error) => {
        toast({
          description: `Failled to load all posts ${error}`,
          className: "text-red-400",
        });
      });
  }, []);
  return (
    <>
      <section className="overflow-x-clip mx-auto pt-5 pb-9 flex flex-col items-center h-full dark:bg-[#0D0D0D] bg-neutral-100 dark:border-none w-full lg:w-5/6 border-t border-t-neutral-300">
        <div className="flex justify-center md:justify-between items-center h-[10%] w-full my-5 md:px-14 ">
          <div className="flex items-center md:gap-5">
            <h1 className="hidden md:block text-heading text-md md:text-3xl font-semibold">
              Your Blogs
            </h1>
            <div className="flex w-60 justify-center items-center gap-1 scale-100 ">
              <Input type="text" placeholder="Search" className="ex-input" />
              <Button
                variant="yellow"
                className="transform transition-transform duration-150 active:scale-95 focus:outline-none"
              >
                Search
              </Button>
            </div>
          </div>
          <div className="flex gap-1 h-full items-center pr-3">
            <Button className="bg-neutral-700 h-7 rounded-full text-white hidden md:flex">
              Recent
            </Button>
            <Button className="bg-neutral-700 h-7 rounded-full text-white hidden md:flex">
              Week
            </Button>
            {isUserLoggedIn && (
              <>
                <Button
                  onClick={() => navigate("/blogs/create-blog")}
                  variant="yellow"
                  className="ml-5 md:scale-100 scale-75 "
                >
                  Create
                </Button>
              </>
            )}
          </div>
        </div>
        <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-5 w-full  px-15">
          {userBlogs.map((post) => (
            <li key={post.slug} className="w-full md:p-10">
              <div className="h-[25rem]">
                <BlogCard
                  title={post.title}
                  description={post.description}
                  content={post.content}
                  createdAt={post.createdAt}
                  postImageUrl={post.imageFile}
                  slug={post.slug}
                  _id={post._id}
                />
              </div>
            </li>
          ))}
          {isLoading && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 w-screen px-20">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </div>
            </>
          )}
        </div>
        {userBlogs.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full w-full py-10 gap-10">
            <h1 className="text-content text-md md:text-3xl font-semibold">
              You have not posted anything yet..
            </h1>
            <MailWarning color="gray" size={100} />
          </div>
        )}
      </section>
    </>
  );
}

export default UserBlogs;
