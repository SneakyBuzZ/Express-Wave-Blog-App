import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { RTEditor, Button, Input, Select } from "../index"
import databaseService from "../../appwrite/config"
import { useNavigate } from "react-router-dom"
// import { useSelector } from "react-redux"

function PostForm({ post }) {

    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })

    const navigate = useNavigate();
    const userId = "65ed5990922e58642ac1";


    const submit = async (data) => {
        if (post) {
            const file = data.featureImage[0] ? await databaseService.uploadFile(data.featureImage[0]) : null;

            if (file) {
                databaseService.deleteFile(post.featureImage)
            }

            const updatePost = await databaseService.updatePost(post.$id, { ...data, featureImage: file ? file.$id : undefined });
            if (updatePost) {
                navigate(`/post/${updatePost.$id}`);
            }
        } else {
            const file = await databaseService.uploadFile(data?.featureImage[0]);
            console.log("this is FILE : ", file);

            if (file) {
                const fileId = file.$id;
                console.log("this is FILEID : ", fileId);
                data.featureImage = fileId;
                console.log("this is DATA :- ", { ...data, userId: userId });
                console.log("THIS IS USERDATA : ", userId)
                const createPost = await databaseService.createPost({ ...data, userId: userId });
                console.log(data)

                if (createPost) {
                    console.log("POSTED!")
                    navigate(`/post/${createPost.$id}`)
                }
            }
        }
    }

    const slugTranform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, '-')
                .replace(/\s/g, '-');

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "slug") {
                setValue("slug", slugTranform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTranform, setValue]);



    return (
        <>
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
                <div className="w-full px-3 py-5 flex justify-center items-center border border-black rounded-lg">
                    <div className="flex flex-col">
                        <Input
                            label="title"
                            placeholder="title"
                            onInput={(e) => {
                                setValue("slug", slugTranform(e.currentTarget.value), { shouldValidate: true });
                            }}
                            {...register("title", { required: true })}
                        />
                        <Input
                            label="slug"
                            placeholder="slug"
                            {...register("slug", { required: true })}

                        />
                        <RTEditor label="content: "
                            name="content"
                            control={control}
                            defaultValue={getValues("content")} />
                        <Input
                            label="featured image"
                            type="file"
                            className="mb-3"
                            accept="image/png , image.jpg , image/jpeg , image/gif"
                            {...register("featureImage", { required: !post })}
                        />
                        {
                            post && (
                                <div className="w-full mb-4">
                                    <img src={databaseService.getFilePreview(post.featureImage)}
                                        alt={post.title}
                                        className="rounded-md " />
                                </div>
                            )
                        }
                        <Select
                            option={["active", "inactive"]}
                            label="status"
                            className="mb-4"
                            {...register("status", { required: true })}
                        />
                        <Button
                            type="submit"
                            backgroundColor={post ? "bg-blue-500" : "bg-stone-400"}
                            color="white"
                            className="mb-4"
                        >
                            {post ? " Update" : " Upload"}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default PostForm