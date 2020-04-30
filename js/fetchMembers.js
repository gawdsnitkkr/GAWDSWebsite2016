const requestURL =
  "https://spreadsheets.google.com/feeds/cells/1DmQG7l-C4mlp3puiogcGWHiqV4Ru9rNtCLZOqJ2fr9Q/1/public/values?alt=json";

const request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.send();
request.onload = function () {
  const jsonObj = request.response;
  populateContent(jsonObj);
};

function populateContent(jsonObj) {
  const noOfFields = 6;
  let noOfAlumni = jsonObj["feed"]["entry"].length / noOfFields - 1;
  for (let i = 1; i <= noOfAlumni; i++) {
    let memberNameContainer =
      '<div class="Name">' +
      jsonObj["feed"]["entry"][i * noOfFields + 1]["content"]["$t"].split(" ")[0] +
      "</div>";

    let memberContainer =
      '<div class="Member" data-image="aman.jpg" style="background-image: url(' +
      jsonObj["feed"]["entry"][i * noOfFields + 2]["content"]["$t"] +
      '); opacity: 1">' +
      memberNameContainer +
      "</div>";

    $("#MemberContainer").append(memberContainer);
  }
}
