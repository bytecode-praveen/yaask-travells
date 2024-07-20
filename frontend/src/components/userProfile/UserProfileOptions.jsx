/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { profileOptions } from "./userProfileApi";

const UserProfileOptions = ({ setShowPopup, setSelectedOption }) => {
  const userProfile = useSelector(
    (state) => state.user.userDetails?.profileDetails.profile
  );
  const panNo = useSelector(
    (state) => state.user.userDetails?.panNo
  );
  const gstNo = useSelector(
    (state) => state.user.userDetails?.gstNo
  );

  return (
    <>
      <div className=" flex flex-col">
        <div>
          <h1 className=" text-[#222222] text-[32px] font-semibold">
            Your profile
          </h1>
          <div className=" text-base text-[#717171] max-w-[85%] mt-5">
            The information you share will be used across to help other
            guests and Hosts get to know you.
          </div>
        </div>
        <section className=" grid grid-cols-2 gap-x-16 mt-4">
            <div
                className="border-b border-[#dedede] cursor-pointer"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setSelectedOption({
                    "name": "PAN Number",
                    "img": "/src/assets/basicIcon/userProfile/schoolIcon.png",
                    "popUpContent": {
                      "header": "What is your PAN Number?",
                    },
                    "fieldName": "panNo"
                });
                  setShowPopup((prev) => !prev);
                }}
              >
                <div className=" flex flex-row gap-3 items-center py-6 px-2 hover:bg-[#f7f7f7] rounded-xl">
                    <div className="text-base text-[#717171]">
                      <p>
                        PAN Number : {panNo}
                      </p>
                    </div>
                </div>
            </div>
            <div
                className="border-b border-[#dedede] cursor-pointer"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setSelectedOption({
                    "name": "GST Number",
                    "img": "/src/assets/basicIcon/userProfile/schoolIcon.png",
                    "popUpContent": {
                      "header": "What is your GST Number?",
                    },
                    "fieldName": "gstNo"
                });
                  setShowPopup((prev) => !prev);
                }}
              >
                <div className=" flex flex-row gap-3 items-center py-6 px-2 hover:bg-[#f7f7f7] rounded-xl">
                    <div className="text-base text-[#717171]">
                      <p>
                        GST Number : {gstNo}
                      </p>
                    </div>
                </div>
            </div>
          {profileOptions.map((option, i) => {
            console.log(option);
            /* The code block is iterating over the `profileOptions` array and the `userProfile` object to find a matching field name. */
            let savedProfileData;
            for (const keys in option) {
              let fieldName = option[keys];
              for (const profileKeys in userProfile) {
                if (fieldName === profileKeys) {
                  savedProfileData = userProfile[profileKeys];
                }
              }
            }
            return (
              <div
                key={i}
                className="border-b border-[#dedede] cursor-pointer"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setSelectedOption(option);
                  setShowPopup((prev) => !prev);
                }}
              >
                <div className=" flex flex-row gap-3 items-center py-6 px-2 hover:bg-[#f7f7f7] rounded-xl">
                  <img src={option.img} alt="Options" className=" w-7" />
                  {savedProfileData ? (
                    <div className="text-base text-[#717171]">
                      <p>
                        {savedProfileData.name} : {savedProfileData.value}
                      </p>
                    </div>
                  ) : (
                    <p className=" text-base text-[#717171]">{option.name}</p>
                  )}
                </div>
              </div>
            );
          })}
           
        </section>
      </div>
    </>
  );
};

export default UserProfileOptions;
