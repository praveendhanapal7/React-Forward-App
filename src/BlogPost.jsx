import { Link, Navigate, useParams } from "react-router-dom";
import "./Pages.css";
import { getBlogPostBySlug } from "./blogPosts";

function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug || "");

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const Icon = post.icon;

  return (
    <section className="PageShell">
      <div className="PageHero">
        <p className="PageTag">{post.category}</p>
        <h1 className="PageTitle">{post.title}</h1>
        <p className="PageLead">{post.text}</p>
      </div>

      <div className="PageSection">
        <article className="InfoCard">
          <div className="IconTitle">
            <span className="CardIcon">
              <Icon />
            </span>
            <h3>Detailed Breakdown</h3>
          </div>

          <div className="NarrativeBlock">
            {post.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p style={{ marginTop: "16px" }}>
            <Link to="/blog">← Back to Blog</Link>
          </p>
        </article>
      </div>
    </section>
  );
}

export default BlogPost;
