module.exports = {
  siteMetadata: {
    name: `CWDC Website`,
    description: "CWDC Website",
    keywords: ["Carleton University", "Web dev"],
    siteUrl: "https://cwdc-guillaume-demo.netlify.com",
    siteImage: "",
    profileImage: "",
    lang: `eng`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/..`,
        ignore: [`**/website/**/*`, `**/\.*`],
      },
    },
    `gatsby-transformer-remark`,
  ],
};
