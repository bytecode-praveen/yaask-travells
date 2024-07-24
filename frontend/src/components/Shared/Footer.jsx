import facebookIcon from "../../assets/basicIcon/facebookIcon.svg";
import linkedinIcon from "../../assets/basicIcon/linkedinIcon.svg";
import { useSelector } from "react-redux";

const Footer=() => {
  const user=useSelector((state) => state.user.userDetails);
  return (
    <footer className=" py-12 bg-[#f7f7f7] border-t border-[#dddddd] text-sm text-[#222222] relative bottom-0 z-[20]">
      <section className=" grid grid-cols-2 md:grid-cols-4 gap-8 justify-between max-w-screen-2xl mx-auto px-10">
        <div className="flex flex-col gap-4 opacity-80">
          <a href="mailto:support@hotelbox.in">
            <h6 className="font-semibold">Support</h6>
          </a>
          <a href="mailto:info@hotelbox.in">
            <p>Help Center</p>
          </a>



        </div>
        <div className="flex flex-col gap-4 opacity-80">
          <h6 className="font-semibold">Top Brands</h6>

          <p>WelcomHotel</p>


          <p>Fairmont</p>


          <p>Radisson</p>


          <p>Lemon Tree</p>


          <p>Marriot</p>


          <p>The Lalit</p>

        </div>

        <div className="flex flex-col gap-4 opacity-80">
          <h6 className="font-semibold">Popular Cities</h6>
          <a href="/?category=gujrat">
            <p>Gujrat</p>
          </a>
          <a href="/?category=udaipur">
            <p>Udaipur</p>
          </a>
          <a href="/?category=jaipur">
            <p>Jaipur</p>
          </a>
          <a href="/?category=goa">
            <p>Goa</p>
          </a>
          <a href="/?category=jodhpur">
            <p>Jodhpur</p>
          </a>
          <a href="/?category=mumbai">
            <p>Mumbai</p>
          </a>
        </div>
        <div className="flex flex-col gap-4 opacity-80">
          <h6 className="font-semibold">Reach Us</h6>
          {user?.emailId.includes('hotelbox')&&
            <a href="/host/homes">
              <p>Upload Property</p>
            </a>
          }
          <a href="tel:+91 8141488868">
            <p>+91 8141488868</p>
          </a>
          <a href="#">
            <p>Address: </p>
            <p>LS No.122, Rajpath Rangoli Rd,
              near Shivalik Villa, beside Aangan Farm Cross Road, Ambli, Ahmedabad, Gujarat 380058</p>
          </a>
        </div>
      </section>
      <hr className="bg-[#f7f7f7] mt-10 mb-6" />
      <section className=" flex flex-row flex-wrap justify-between gap-10 px-10 max-w-screen-2xl mx-auto">
        <div className=" flex flex-row flex-wrap items-center">
          <p>© 2024 HotelBox LLP.</p>
          <span className=" p-3">·</span>
          <p>Terms</p>
          <span className=" p-3">·</span>
          <p>Privacy</p>
          <span className=" p-3">·</span>
          <p>Your Privacy Choices</p>
        </div>
        <div className=" flex flex-row gap-5 min-w-[120px] items-center">
          <p>English (US)</p>
          <a href="https://www.facebook.com/hotelbox.in">
            <img src={facebookIcon} alt="Facebook" className=" w-6" />
          </a>
          <a href="https://www.linkedin.com/company/hotelbox-llp">
            <img src={linkedinIcon} alt="Linkedin" className=" w-6" />
          </a>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
