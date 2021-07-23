// export const confirmButtonColor = () => "#ffcc00";
export const confirmButtonColor = () => "#501390";//"#3949ab";
// export const confirmButtonTextColor = () => "navy";
export const confirmButtonTextColor = () => "white";
export const confirmButtonBorderWidth = () => 1;
export const confirmButtonBorderRadius = () => 20;
export const confirmButtonBorderColor = () => "white";
export const confirmButtonElevation = () => 5;

export const confirmButtonContainer = () => ({
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: confirmButtonBorderRadius(),
    borderWidth: confirmButtonBorderWidth(),
    borderColor: confirmButtonBorderColor(),
    backgroundColor: confirmButtonColor(),
    elevation: confirmButtonElevation(),

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
});

export const confirmButtonText = () => ({
    fontSize: 22,
    fontWeight: "bold",
    color: confirmButtonTextColor(),
});

export const productBox = () => ({
    backgroundColor: "white",
    width: 130,
    paddingTop: 2,
    paddingLeft: 7,
    paddingRight: 5,
    paddingBottom: 5,
    marginRight: 15,
    marginVertical: 10,
    
    borderRadius: 15,
    // borderColor: "#f3f3f3",
    // borderWidth: 1,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 4,
});

export function fwidthSize2(x) {
    console.log(x);
    return "50%";
};