import { Link } from "@reach/router";
import { updatePost } from "../api";
// import { loadPosts, updatePost } from "../api";
import { useState } from "react";
import { useToggle } from "../hooks/useToggle";
import {usePosts} from "../hooks/usePosts.js";
// import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";

export function Posts() {
    const [page, setPage] = useState(1);
    const { posts, loading, setPosts } = usePosts(page);

    const handleTitleUpdate = async ({id, title}) => {
      console.log('id')
      console.log(id)
      console.log('post')
      console.log(title)
      const editedPost = await updatePost(id, {title});
      setPosts((posts) => posts.map((p) => (p.id === editedPost.id ? editedPost : p)));
    };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Les articles</h2>

      {/*{isFetching && (*/}
      {/*  <div className="ui active centered mini inverted inline loader fixed" />*/}
      {/*)}*/}

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

/*
export function Posts() {
    const [page] = useState(1);
    // const [page, setPage] = useState(1);
    const { posts, setPosts } = usePosts(page);
    // const { posts, loading, setPosts } = usePosts(page);

    const handleTitleUpdate = async (post, value) => {
        const editedPost = await updatePost(post.id, { title: value });
        setPosts((posts) => posts.map((p) => (p.id === editedPost.id ? editedPost : p)));
    };

  // const queryClient = useQueryClient();
  // const queryKey = ["posts"];
  //
  // const { isLoading, data, isFetching, fetchNextPage } = useInfiniteQuery(
  //   queryKey,
  //   {
  //     queryFn: ({ pageParam }) => loadPosts(pageParam || 1),
  //     getNextPageParam: (lastPage, allPages) => allPages.length + 1,
  //   }
  // );

  // const { mutate: updatePostTitle } = useMutation({
  //   mutationFn: ({ id, title }) => updatePost(id, { title }),
  //   onMutate: async ({ id, title }) => {
  //     await queryClient.cancelQueries(queryKey);
  //     const previousPosts = queryClient.getQueryData(queryKey);
  //     queryClient.setQueryData(queryKey, (data) => {
  //       return {
  //         ...data,
  //         pages: data.pages.map((page) =>
  //           page.map((post) =>
  //             post.id === id ? { ...post, title: title } : post
  //           )
  //         ),
  //       };
  //     });
  //     return { previousPosts };
  //   },
  //   onError: (err, newTodo, context) => {
  //     queryClient.setQueryData(queryKey, context.previousPosts);
  //   },
  // });

  // const posts = data?.pages?.flat() || [];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Les articles</h2>

      {/!*{isFetching && (*!/}
      {/!*  <div className="ui active centered mini inverted inline loader fixed" />*!/}
      {/!*)}*!/}

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
*/

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
        {post.date_created !== undefined ? (new Intl.DateTimeFormat("fr-FR", {
          dateStyle: "full",
        }).format(new Date(post.date_created))) : ""}
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
