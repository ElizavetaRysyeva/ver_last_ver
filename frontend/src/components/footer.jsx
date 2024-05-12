import { useSelector } from "react-redux";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const C = () => {
  const isLoggedIn = useSelector((state) => state.toolkit.isLoggedIn);
  const user = useSelector((state) => state.toolkit.user);
  const isAdmin = user?.roles?.indexOf("ROLE_ADMIN") > -1;

  return (
    <div className="footer bg-gradient py-3" >
      <Container>
        <div className="d-flex flex-row justify-content-between align-items-center">
          {isLoggedIn && isAdmin && (
            <Button variant="light" as={Link} to="/admin">
              Интерфейс администратора
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};

export default C;
