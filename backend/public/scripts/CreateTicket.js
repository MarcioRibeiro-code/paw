document.addEventListener("DOMContentLoaded", function () {
    var dateInput = document.getElementById("date");
    var localsSelect = document.getElementById("locals");
    var eventsSelect = document.getElementById("events");
    var prevSelectedDate = "";
    var prevSelectedLocalId = "";

    localsSelect.addEventListener("change", handleRequest);
    dateInput.addEventListener("change", handleRequest);

    function handleRequest() {
      var selectedDate = dateInput.value;
      var selectedLocalId = localsSelect.value;

      if (
        selectedDate &&
        selectedLocalId &&
        (selectedDate !== prevSelectedDate ||
          selectedLocalId !== prevSelectedLocalId)
      ) {
        var url =
          "filteredEvents/" +
          encodeURIComponent(selectedDate) +
          "/" +
          encodeURIComponent(selectedLocalId);

        fetch(url)
          .then(function (response) {
            if (!response.ok) {
             // console.log("Error:", response.status);
              return [];
            }
            return response.json();
          })
          .then(function (filteredEvents) {
            //console.log("Filtered Events:", filteredEvents);

            eventsSelect.innerHTML = "";

            if (Array.isArray(filteredEvents)) {
              filteredEvents.forEach(function (event) {
                var option = document.createElement("option");
                option.value = event._id;
                option.text = event.title;
                eventsSelect.appendChild(option);
              });
            } else {
            //  console.log(
             //   "Filtered Events is not iterable. Setting to empty array."
              //);
              filteredEvents = [];
            }
          })
          .catch(function (error) {
           // console.log("Error:", error.message);
            eventsSelect.innerHTML =
              "<option value=''>No events available</option>";
          });

        prevSelectedDate = selectedDate;
        prevSelectedLocalId = selectedLocalId;
      }
    }
  });
  document.addEventListener("DOMContentLoaded", function () {
    var freeSelect = document.getElementById("free");
    var priceDiv = document.getElementById("priceDiv");
  
    freeSelect.addEventListener("change", function () {
      var selectedValue = freeSelect.value;
      priceDiv.style.display = selectedValue === "true" ? "none" : "block";
    });
  });