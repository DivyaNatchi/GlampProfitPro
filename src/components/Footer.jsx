import "../styles/footer.css";
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer row">
      <div className="col-12"></div>
      <p className="copyrightText">
        Copyright © 1999 - {currentYear} Wigwam Holidays Ltd | All rights
        reserved
      </p>
      <div>
        <a href="https://www.bytesizeitsolutions.com" target="_blank">
          Site Made by Byte Size IT Solutions
        </a>
      </div>
    </div>
  );
}
