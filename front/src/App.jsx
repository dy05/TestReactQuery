import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Posts } from "./pages/Posts";
import { Post } from "./pages/Post";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/posts/:post" element={<Post />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
