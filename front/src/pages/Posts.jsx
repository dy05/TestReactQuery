import { Link } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import { updatePost } from "../api";
import { useState } from "react";
import { useToggle } from "../hooks/useToggle";

export function Posts() {
  const [page, setPage] = useState(1);
  const { posts, loading, setPosts } = usePosts(page);

  const handleTitleUpdate = async (post, value) => {
    const editedPost = await updatePost(post.id, { title: value });
    setPosts((posts) =>
      posts.map((p) => (p.id === editedPost.id ? editedPost : p))
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Les articles</h2>

      <table
        className="ui very basic collapsing celled table"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Date de création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <PostRow
              onTitleUpdate={handleTitleUpdate}
              post={post}
              key={post.id}
            />
          ))}
          {loading && (
            <tr>
              <td colSpan={5}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex" style={{ paddingBottom: "3rem" }}>
        <button
          className="ui button"
          onClick={() => setPage((v) => v + 1)}
          disabled={loading}
        >
          Page suivante
        </button>
      </div>
    </div>
  );
}

function PostRow({ post, onTitleUpdate }) {
  const [state, setState] = useState("view");
  const [loading, toggleLoading] = useToggle();
  const handleBlur = async (e) => {
    toggleLoading();
    const value = e.target.value;
    await onTitleUpdate(post, value);
    toggleLoading();
    setState("view");
  };
  return (
    <tr>
      <td>
        <Link to={`/posts/${post.id}`}>#{post.id}</Link>
      </td>
      <td className="ui form">
        {state === "view" && (
          <div onDoubleClick={() => setState("edit")}>{post.title}</div>
        )}
        {state === "edit" && (
          <div>
            <input
              defaultValue={post.title}
              onBlur={handleBlur}
              autoFocus
              disabled={loading}
            />
            {loading && (
              <div className="ui active inverted dimmer">
                <div className="ui mini loader" />
              </div>
            )}
          </div>
        )}
      </td>
      <td>
        {post.status === "published" ? (
          <span className="ui green empty circular label">&nbsp;</span>
        ) : (
          <span className="ui grey empty circular label">&nbsp;</span>
        )}
      </td>
      <td>
        {new Intl.DateTimeFormat("fr-FR", {
          dateStyle: "full",
        }).format(new Date(post.date_created))}
      </td>
      <td>
        <Link to={`/posts/${post.id}`} className="ui small button">
          <i className="icon edit alternate outline" />
          Modifier
        </Link>
      </td>
    </tr>
  );
}
