var mainCtrl = angular.module("mainCtrl", []);

mainCtrl.controller("MainController", function($scope, $http, $window){


  $http.get('/fedHistory').then((data)=>{
    //we want a weeks worth of data
    console.log("fantastic!", data);
    var svrData = data.data.data;

    var matthew = 0;
    var john = 0;
    var samantha = 0;
    var mom = 0;
    var dad = 0;
    var sue = 0;

    svrData.forEach((meal)=>{
      switch(meal.user){
        case "Matthew":
          matthew++
          break;
        case "John":
          john++;
          break;
        case "Samantha":
          samantha++;
          break;
        case "Mom":
          mom++;
          break;
        case "Dad":
          dad++;
          break;
        case "Sue":
          sue++;
          break;
        default:
          console.log("some error");
          break;
      }
    })

    //how to get chart to be smaller

    var fedHistory = [matthew, john, samantha, mom, dad, sue];

    var ctx = document.getElementById("myChart").getContext('2d');
    ctx.height = 500;
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Matthew", "John", "Samantha", "Mom", "Dad", "Sue"],
            datasets: [{
                label: 'Fed Fred in Past Week',
                data: [fedHistory[0], fedHistory[1], fedHistory[2], fedHistory[3], fedHistory[4], fedHistory[5]],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });



    //

  });
});

mainCtrl.directive("analytics", [()=>{
  return{
    restrict: 'E',
    scope: {

    },
    templateUrl: 'src/views/analytics.html',
    transclude: true,
    replace: true,
    controller: function ($http, $scope){
      //now we need to get that stuff
      //

    }
  }
}])

mainCtrl.directive("walk", [()=>{
  return{
    restrict: 'E',
    scope: {

    },
    templateUrl: 'src/views/walk.html',
    transclude: true,
    replace: true,
    controller: function ($http, $scope){

      //we have to do a calculations

            $scope.familyMembers = {
              people:[
              {
              name: 'Matthew'
              },
              {
                name: 'John'
              },
              {
                name: 'Samantha'
              },
              {
                name: 'Mom'
              },
              {
                name: 'Dad'
              },
              {
                name: 'Sue'
              },
            ]
          };
    }
  }
}])

mainCtrl.directive("fredIsFed", [()=>{
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'src/views/fedView.html',
    transclude: true,
    replace: true,
    controller: function($http, $scope){

      $scope.postdata = (user)=>{
        if(typeof user  == "undefined"){
          alert("select a person");
          return;
        }
        $http.post("/fedStatus", {"user": user}).then((data)=>{
          var status = data.data.error;
          if(status == true){
            $scope.msg = "there's was an issue saving";
            $scope.completeFed = 'completeFed';
            setTimeout(()=>{
              location.reload();
            }, 2000);
          }
          if(status == false){


            $scope.msg = "successfully saved!";
          }
        })
      }

      $scope.familyMembers = {
        people:[
        {
        name: 'Matthew'
        },
        {
          name: 'John'
        },
        {
          name: 'Samantha'
        },
        {
          name: 'Mom'
        },
        {
          name: 'Dad'
        },
        {
        name: 'Sue'
        },
      ]
    };

      $http.get('/fedStatus').then((data)=>{
        console.log("last time fed? ", data);
        var svrData = data.data.data;
        var whole = new Date();
        var hour = whole.getHours();

        if(svrData == null){
          $scope.needsToBeFed = true;
        }

        console.log(svrData, "MJG!");

        var hold = svrData.createdAt.split("T")

        svrData.createdAt = hold[0]
        svrData.hourAt = hold[1]

        console.log(svrData.createdAt);

        const year = whole.getFullYear();
        var month = whole.getMonth()+1;
        const date = whole.getDate();

        if(month < 10){
          month = "0"+month
        }

        const nowDate = year+"-"+month+"-"+date;

        //all the pieces are here, just need to assemble them right


        if(hour < 12){
          //looking for breakfast
          if(svrData.createdAt !== nowDate){
            $scope.needsToBeFed = true;
            //thus still needs breakfast
          }
          if(svrData.createdAt ==  nowDate){
            $scope.needsToBeFed = false;
            $scope.lastFed = svrData.user;
          }
        }
        if(hour > 12){
          console.log("dinner time");
          console.log(svrData.createdAt == nowDate);
          //case: fed this morning, and recorded
          if(svrData.createdAt == nowDate && svrData.meal !== "dinner"){
            $scope.needsToBeFed = true;
          }
          //case: not recorded this morning
          if(svrData.createdAt != nowDate){
            $scope.needsToBeFed = true;
          }
          //case: already fed
          if(svrData.createdAt == nowDate && svrData.meal == 'dinner'){
            $scope.needsToBeFed = false;
            $scope.lastFed = svrData.user;
          }

        }


      })

    }
  };

}])

mainCtrl.directive('calendar', [()=>{
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'src/views/calendar.html',
    transclude: true,
    replace: true,
    controller: function($http, $scope){

      $scope.sendRideInfo = (eventName, inputData, whatIsIt) => {
        console.log("did we receive everything?",eventName, inputData, whatIsIt);

        $http.post("/rideInfo", {})

      }

      $scope.loadingCalendar = true;


      $http.get('/calendar').then((data)=>{
        $scope.loadingCalendar = false;
        console.log("did we get it?", data);

        var grab = [];


        for(var m = 0; m < data.data.data.length; m+=3){

          grab.push({
            start: data.data.data[m],
            end: data.data.data[m+1],
            event: data.data.data[m+2],
          })
        }

        $scope.data = grab;


        var months = [
          'matthew',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
        ];

        $scope.month = months[data.data.date.month];
        $scope.year = data.data.date.year;
        $scope.day = data.data.date.day;
      });

    }
  };

} ])
