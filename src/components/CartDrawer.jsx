import { Avatar, Badge, Button, Drawer, Space } from "antd";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";
import EmptyCart from "./EmptyCart";
import ButtonGroup from "antd/es/button/button-group";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
const CartDrawer = ({ open, setOpen }) => {
  const [show, setShow] = useState(true);
  const cartDataList = JSON.parse(localStorage.getItem("cart")) || [];

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const storedCartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCartData(storedCartData);
  }, [cartData]);

  const delItem = (id) => {
    const updatedCartData = cartData.filter((item) => item.id !== id);
    setCartData(updatedCartData);
    localStorage.setItem("cart", JSON.stringify(updatedCartData));
    toast.success(<span>Item Removed Successfully!</span>);
  };

  const updateItemQty = (action, id) => {
    let updatedCartData;
    const existingItemIndex = cartData.findIndex((item) => item.id === id);

    if (existingItemIndex !== -1) {      
      updatedCartData = cartData.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              qty:
                action === "add"
                  ? item.rating.count > item.qty
                    ? item.qty + 1
                    : message.error("Item limit exceed") && item.qty
                  : Math.max(item.qty - 1, 1),
            }
          : item
      );
    } else {
      const newItem = cartDataList.find((item) => item.id === id);
      console.log("else newItme" , newItem)
      updatedCartData = newItem
        ? [...cartData, { ...newItem, qty: 1 }]
        : [...cartData];
    }

    setCartData(updatedCartData);
    localStorage.setItem("cart", JSON.stringify(updatedCartData));


  };

  return (
    <>
      <Drawer title="Cart Details" open={open} onClose={() => setOpen(false)}>
        {cartDataList.length == 0 ? (
          <EmptyCart description={"No items in cart yet ..."} show={"none"} />
        ) : (
          cartDataList.map((value, i) => (
            <Card className="max-w-[400px] mb-5 poppins" key={i}>
              <CardHeader className="flex gap-3">
                <Image
                  alt="nextui logo"
                  height={40}
                  radius="sm"
                  src={value.image}
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md font-semibold">{value.title}</p>
                  <p className="text-small text-default-500 capitalize">
                    Category: {value.category}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="capitalize">{value.description}</p>
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-between items-start">
                <Space size="large">
                  <ButtonGroup>
                    <Button
                      className="mr-2"
                      onClick={() => updateItemQty("minus", value.id)}
                      icon={<MinusOutlined />}
                    />
                    <Badge
                      className="mr-2 mt-1"
                      count={value.qty}
                      overflowCount={value.qty >= 100 ? value.qty : undefined}
                    ></Badge>
                    <Button
                      onClick={() => updateItemQty("add", value.id)}
                      icon={<PlusOutlined />}
                    />
                  </ButtonGroup>
                </Space>
                <div>
               <span className="font-bold">$ {Math.round(value.price  * value.qty)} /-</span>{" "}
                </div>
                <div>
                  <DeleteOutlined
                    className="text-red-400 text-lg mt-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110
                  duration-300 cursor-pointer"
                    onClick={() => delItem(value.id)}
                  />
                </div>
              </CardFooter>
            </Card>
          ))
        )}
        <div className="flex flex-col ">
          <div className="flex-grow ">
            {cartDataList.length > 0 && (
              <Button type="primary" className="bg-blue-500 outfit" block>
               <Link to={'/checkout'}>Check Out</Link> 
              </Button>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};
export default CartDrawer;
