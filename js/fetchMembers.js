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
  const date = new Date();
  let members = [];
  for (let i = 1; i <= noOfAlumni; i++) {
    const batch = jsonObj["feed"]["entry"][i * noOfFields + 5]["content"]["$t"].split("-")[1];
    if(batch > date.getFullYear() || (+batch === date.getFullYear() && date.getMonth() < 5)) {
      const memberNameContainer = '<div class="Name">' + jsonObj["feed"]["entry"][i * noOfFields + 1]["content"]["$t"] + "</div>";
      const linkedInUrl = jsonObj["feed"]["entry"][i * noOfFields + 4]["content"]["$t"];
      const imageUrl = jsonObj["feed"]["entry"][i * noOfFields + 2]["content"]["$t"];
      const memberContainer =
        '<div class="Member" data-image="aman.jpg" style="background-image: url(' + imageUrl +'); opacity: 1; cursor: pointer;" onclick="window.open(\''+linkedInUrl+'\');">' +
        memberNameContainer +
        "</div>";
      const name = jsonObj["feed"]["entry"][i * noOfFields + 1]["content"]["$t"].split(" ")[0];
      members.push({"batch": batch, "data": memberContainer, "name": name});
    }
  }
  // sorting on the basis of batch and name
  members.sort(function(a, b) {
    return a.batch < b.batch ? -1 : a.batch > b.batch ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
  for(const member of members)
    $("#MemberContainer").append(member.data);
}
