import "../styles/footer.css";
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <h1 className="footer">
      <div className="row">
        <div className="col-12"></div>
        <p className="copyrightText">
          Copyright © 1999 - {currentYear} Wigwam Holidays Ltd | All rights
          reserved
        </p>
      </div>
    </h1>
  );
}
