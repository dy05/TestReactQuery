import { Link } from "@reach/router";
import { loadPosts, updatePost } from "../api";
import { useState } from "react";
import { useToggle } from "../hooks/useToggle";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";

export function Posts() {
  const queryClient = useQueryClient();
  const queryKey = ["posts"];

  const { isLoading, data, isFetching, fetchNextPage } = useInfiniteQuery(
    queryKey,
    {
      queryFn: ({ pageParam }) => loadPosts(pageParam),
      getNextPageParam: (lastPage, allPages) => allPages.length + 1,
    }
  );

  const { mutate: updatePostTitle } = useMutation({
    mutationFn: ({ id, title }) => updatePost(id, { title }),
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries(queryKey);
      const previousPosts = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (data) => {
        return {
          ...data,
          pages: data.pages.map((page) =>
            page.map((post) =>
              post.id === id ? { ...post, title: title } : post
            )
          ),
        };
      });
      return { previousPosts };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKey, context.previousPosts);
    },
  });

  const posts = data?.pages?.flat() || [];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Les articles</h2>

      {isFetching && (
        <div className="ui active centered mini inverted inline loader fixed" />
      )}

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
              onTitleUpdate={updatePostTitle}
              post={post}
              key={post.id}
            />
          ))}
          {isLoading && (
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
          onClick={fetchNextPage}
          disabled={isLoading || isFetching}
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
    await onTitleUpdate({ id: post.id, title: value });
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
