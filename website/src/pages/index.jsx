import React from "react";

const IndexPage = ({ data }) => {
  const { allMarkdownRemark } = data;
  const { edges } = allMarkdownRemark;

  const home = edges.find(({ node }) =>
    node.fileAbsolutePath.includes("Home.md")
  ).node.html;
  const gettingStarted = edges.find(({ node }) =>
    node.fileAbsolutePath.includes("Getting-Started.md")
  ).node.html;
  const generalResources = edges.find(({ node }) =>
    node.fileAbsolutePath.includes("General-Resources.md")
  ).node.html;
  const frontEndResources = edges.find(({ node }) =>
    node.fileAbsolutePath.includes("Front-End-Resources.md")
  ).node.html;
  const backEndResources = edges.find(({ node }) =>
    node.fileAbsolutePath.includes("Back-End-Resources.md")
  ).node.html;
  const usefulAPIs = edges.find(({ node }) =>
    node.fileAbsolutePath.includes("Useful-APIs.md")
  ).node.html;

  return (
    <div className="terminal">
      <div className="container">
        <nav className="terminal-nav">
          <header className="terminal-logo">
            <div className="logo terminal-prompt">CWDC Website</div>
          </header>
        </nav>
        <main>
          <article dangerouslySetInnerHTML={{ __html: home }} />
          <article dangerouslySetInnerHTML={{ __html: gettingStarted }} />
          <article dangerouslySetInnerHTML={{ __html: generalResources }} />
          <article dangerouslySetInnerHTML={{ __html: frontEndResources }} />
          <article dangerouslySetInnerHTML={{ __html: backEndResources }} />
          <article dangerouslySetInnerHTML={{ __html: usefulAPIs }} />
        </main>
      </div>
    </div>
  );
};

export const pageQuery = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          html
          fileAbsolutePath
        }
      }
    }
  }
`;

export default IndexPage;
