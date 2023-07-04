async function hideCommentForm(event) {
    // Prevent form from refreshing the page
    event.preventDefault();
  
    // Access the form that was submitted and the comment that was typed
    const form = event.target;
    const comment = form.elements.comment.value;
  
    // Send a POST request to the server to create a new comment
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    });
  
    if (response.ok) {
      // Hide the comment form if the POST request was successful
      document.getElementById("comment-form").style.display = "none";
  
      // Fetch the new comment from the server
      const newComment = await response.json();
  
      // Create a new div for the comment
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");
  
      // Create a new p element for the comment text
      const commentText = document.createElement("p");
      commentText.textContent = comment;
      commentDiv.appendChild(commentText);
  
      // Format the current date to mm/dd/yyyy
      const date = new Date(newComment.createdAt);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  
      // Create a new p element for the comment details
      const commentDetails = document.createElement("p");
      commentDetails.classList.add("comment-details");
      commentDetails.textContent = ` - ${newComment.username}, ${formattedDate}`;
      commentDiv.appendChild(commentDetails);
  
      // Append the new comment to the comments div
      const commentsDiv = document.getElementById("comment-content");
      commentsDiv.appendChild(commentDiv);
  
      // Show the comments div
      document.getElementById("show-comments").style.display = "block";
    } else {
      alert('Failed to post comment');
    }
}