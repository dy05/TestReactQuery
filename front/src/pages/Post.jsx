import { Link } from "@reach/router";
import { usePost } from "../hooks/usePost";
import { loadPost, updatePost } from "../api";
import { useState } from "react";
import clsx from "clsx";
import { Message } from "../ui/Flash";
import { useToggle } from "../hooks/useToggle";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function Post({ post: postId }) {
  const queryKey = [`posts`, postId];
  const { isLoading, data: post } = useQuery(queryKey, () => loadPost(postId));

  const queryClient = useQueryClient();

  const {
    isLoading: isUpdating,
    mutate,
    isSuccess: isUpdated,
    reset: resetUpdate,
  } = useMutation({
    mutationFn: (data) => updatePost(postId, data),
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });

  if (isLoading) {
    return <div className="ui active centered inline loader" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      ...Object.fromEntries(formData),
      status: formData.get("published") ? "published" : "draft",
    };
    mutate(data);
  };

  return (
    <div>
      {isUpdated && (
        <Message onClose={resetUpdate}>L'article a bien été sauvegardé</Message>
      )}

      <h1>Editer "{post.title}"</h1>
      <p>
        <Link to="/">Revenir en arrière</Link>
      </p>
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="ui grid">
          <div className="eleven wide column field">
            <label>Titre</label>
            <input type="text" name="title" defaultValue={post.title} />
          </div>
          <div className="one wide column field">
            <label>Publié</label>
            <div className="ui toggle checkbox">
              <input
                type="checkbox"
                name="published"
                defaultChecked={post.status === "published"}
              />
              <label />
            </div>
          </div>
        </div>
        <div className="field">
          <label>Content</label>
          <textarea name="content" defaultValue={post.content} />
        </div>
        <button
          className={clsx("ui button primary", isUpdating && "loading")}
          disabled={isUpdating}
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
