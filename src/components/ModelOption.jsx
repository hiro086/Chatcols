import { Tag } from "tdesign-react";
import { useTranslation } from "react-i18next";

export default function ModelOption({ option }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-[2px]">
        <img
          src={option.icon}
          className="w-[14px] h-[14px] rounded-sm mr-1"
          alt={option.name}
        />
        <span>{option.name}</span>
        {/* {option.price === -1 && (
          <Tag className="ml-2 scale-[0.8]" size="small" theme="primary">
            Trial
          </Tag>
        )} */}
        {option.price === 0 && (
          <Tag className="ml-2 scale-[0.8]" size="small" theme="primary">
            免费
          </Tag>
        )}
        {!!option.isCustom && (
          <Tag
            className="scale-[0.8]"
            size="small"
            theme="warning"
            variant="light-outline"
          >
            自定义
          </Tag>
        )}
        {!!option.vision && (
          <Tag
            className="scale-[0.8]"
            size="small"
            theme="danger"
            variant="light-outline"
          >
            视觉
          </Tag>
        )}
      </div>
      <div className="flex items-center">
        {!!option.series && (
          <Tag variant="outline" size="small" theme="primary">
            <span className="capitalize">{option.series}</span>
          </Tag>
        )}
        {!!option.length && (
          <Tag variant="outline" size="small" theme="primary" className="ml-2">
            {option.length}K
          </Tag>
        )}
        {option.price > 0 && (
          <Tag className="ml-2" variant="outline" size="small" theme="primary">
            ¥{option.price}/1M
          </Tag>
        )}
      </div>
    </div>
  );
}
