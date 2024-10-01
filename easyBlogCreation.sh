if [ -n "$1" ] ; then
    unname="$1"
else
    echo -n "Enter name of post: "
    read unname
fi

name=$(echo "$unname" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')

txt_file="blogPosts/rudimentary/$unname.txt"

if [[ ! -f "$txt_file" ]]; then
  echo "Error: The file '$txt_file' does not exist."
  exit 1
fi

content=$(cat "$txt_file")

currentDate=$(date "+%Y-%m-%d")

html_content=$(cat <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>"${name}_${currentDate}"</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: #000;
      color: #fff;
      font-family: 'Garamond', serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      overflow: hidden;
    }

    nav {
      position: absolute;
      top: 20px;
      left: 20px;
      display: flex;
      flex-direction: column;
    }

    nav a {
      color: #fff;
      text-decoration: none;
      font-size: 1.2rem;
      margin-bottom: 15px;
      letter-spacing: 0.1em;
      transition: color 0.3s, transform 0.3s;
    }

    nav a:hover {
      color: #8E8a8a;
      transform: scale(1.05);
    }


    .title {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 1.3rem;
      letter-spacing: 0.1em;
      opacity: 0.7;
      transition: opacity 0.3s;
    }

    .title:hover {
      opacity: 1;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 20px;
    }

    .content {
      max-width: 600px;
      text-align: left;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 20px;
    }

    .back-link {
      font-size: 1.2rem;
      color: #8e8a7a;
      text-decoration: none;
      margin-top: 40px;
      display: block;
      text-align: center;
      transition: color 0.3s;
    }

    .back-link:hover {
      color: #8E8a8a;
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <nav>
    <a href="../index.html">Home</a>
    <a href="../portfolio.html">Portfolio</a>
    <a href="../about.html">About Me</a>
    <a href="../blog.html">Blog</a>
  </nav>
  
  <div class="content">
    <h1>${name}</h1>
    <p><strong>Date:</strong> ${currentDate}</p>
    <p>${content}</p>
    
    <a href="../blog.html" class="back-link">Back to Blog</a>
  </div>
</body>
</html>
EOF
)


blog_link="	    <a href=\"blogPosts/${name}_${currentDate}.html\" target=\"_blank\">${name}, ${currentDate}</a>"
  

if [[ ! -f "blog.html" ]]; then
    echo "NO blog.html"
else
    sed -i "/<!-- REMOVE BLOG POST -->/,/<\/a>/d" blog.html
    sed -i "/<!-- INSERT BLOG POSTS HERE1 -->/i <!-- REMOVE BLOG POST -->" blog.html
    sed -i "/<!-- INSERT BLOG POSTS HERE1 -->/i $blog_link" blog.html
    sed -i "/<!-- INSERT BLOG POSTS HERE2 -->/a $blog_link" blog.html
fi


# Create the blog post HTML file
echo "$html_content" > "blogPosts/${name}_${currentDate}.html"

echo "Blog post '$name' created successfully at 'blogPosts/${name}_${currentDate}.html'"
