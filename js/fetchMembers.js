const requestURL = "https://sheets.googleapis.com/v4/spreadsheets/1DmQG7l-C4mlp3puiogcGWHiqV4Ru9rNtCLZOqJ2fr9Q/values/A1:F500?key=AIzaSyCOg87OtIF8dkk94skoQNG0_jRZlV6WCpY";

const request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.send();
request.onload = function () {
  const gawdArray = request.response.values;
  populateContent(gawdArray);
};

function populateContent(gawdArray) {
  let noOfAlumni = gawdArray.length;
  const date = new Date();
  let members = [];
  for (let i = 0; i < noOfAlumni; i++) {
    try {
      const batch = gawdArray[i][5].split("-")[1];
      if(batch > date.getFullYear() || (+batch === date.getFullYear() && date.getMonth() < 5)) {
        const memberNameContainer = '<div class="Name">' + gawdArray[i][1] + "</div>";
        const linkedInUrl = gawdArray[i][4];
        const imageUrl = gawdArray[i][2];
        const memberContainer =
          '<div class="Member" data-image="aman.jpg" style="background-image: url(' + imageUrl +'); opacity: 1; cursor: pointer;" onclick="window.open(\''+linkedInUrl+'\');">' +
          memberNameContainer +
          "</div>";
        const name = gawdArray[i][1].split(" ")[0];
        members.push({"batch": batch, "data": memberContainer, "name": name});
      }
    } catch (err) {
      console.log(err + "\n" + gawdArray[i]);
    }
  }
  // sorting on the basis of batch and name
  members.sort(function(a, b) {
    return a.batch < b.batch ? -1 : a.batch > b.batch ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
  for(const member of members)
    $("#MemberContainer").append(member.data);
}
