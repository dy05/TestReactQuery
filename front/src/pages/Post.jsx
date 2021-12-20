import { Link } from "@reach/router";
import { usePost } from "../hooks/usePost";
import { updatePost } from "../api";
import { useState } from "react";
import clsx from "clsx";
import { Message } from "../ui/Flash";
import { useToggle } from "../hooks/useToggle";

export function Post({ post: postId }) {
  const { loading, post } = usePost(postId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, toggleSaved] = useToggle();

  if (loading) {
    return <div className="ui active centered inline loader" />;
  }

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      ...Object.fromEntries(formData),
      status: formData.get("published") ? "published" : "draft",
    };
    await updatePost(postId, data);
    setIsSubmitting(false);
    toggleSaved();
  };

  return (
    <div>
      {saved && (
        <Message onClose={toggleSaved}>L'article a bien été sauvegardé</Message>
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
                checked={post.status === "published"}
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
          className={clsx("ui button primary", isSubmitting && "loading")}
          disabled={isSubmitting}
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
