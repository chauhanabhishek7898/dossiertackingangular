export function fullPageDisplay() {
    let fullPage = window.location.pathname.split(';').pop()!!.split("=")[1];
    if (fullPage == "true") {
        return true
    } else {
        return false;
    }
}
export function parseDateToString(d: any) {
    if (typeof d == "object") {
        if (d._d) {
            let dt = d._d;
            return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        } else {
            return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        }

    }
    else {
        return d;
    }
}
export function parseDateToStringDate(d: any) {
    if (typeof d == "object") {
        if (d._d) {
            let dt = d._d;
            return dt.getDate()  + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear();
        } else {
            return  d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() ;
        }

    }
    else {
        return d;
    }
}
export function getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx!!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }