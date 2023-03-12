import { Image } from "antd";
import { useState } from "react";

interface Props {
  image: string;
}

export const AssetImage = ({ image }: Props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Image
        preview={{ visible: false }}
        width={180}
        height={180}
        style={{ objectFit: "cover", borderRadius: "8px" }}
        src={image}
        onClick={() => setVisible(true)}
      />
      <div style={{ display: "none" }}>
        <Image.PreviewGroup
          preview={{
            visible,
            onVisibleChange: (vis) => setVisible(vis),
          }}
        >
          <Image src={image} />
        </Image.PreviewGroup>
      </div>
    </>
  );
};
