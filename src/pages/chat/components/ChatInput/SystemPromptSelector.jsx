import { useSystemPrompts } from "@src/utils/system-prompt";
import React, { useState } from "react";
import { Popup, Button, Drawer, Input, Textarea, Form } from "tdesign-react";
import Tooltip from "@src/components/MobileCompatible/Tooltip";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@src/utils/use";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { GUIDE_STEP } from "@src/utils/types";
import CopyToClipboard from "react-copy-to-clipboard";
import { message } from "tdesign-react";
const FormItem = Form.FormItem;

function SystemPromptSelector({}, ref) {
  const { t } = useTranslation();
  const { active, setActive, all, save, remove } = useSystemPrompts();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [editingIcon, setEditingIcon] = useState("");
  const isMobile = useIsMobile();

  useImperativeHandle(ref, () => ({
    next: () => {
      const index = all.findIndex((prompt) => prompt.id === active.id);
      if (index < all.length - 1) {
        setActive(all[index + 1]);
      } else {
        setActive(all[0]);
      }
    },
    pre: () => {
      const index = all.findIndex((prompt) => prompt.id === active.id);
      if (index > 0) {
        setActive(all[index - 1]);
      } else {
        setActive(all[all.length - 1]);
      }
    },
  }));

  const onEdit = (prompt) => {
    setEditingPrompt(prompt);
    if (prompt) {
      form.setFieldsValue(prompt);
      setEditingIcon(prompt.icon);
    } else {
      form.reset();
      form.clearValidate();
      setEditingIcon("");
    }
    setDrawerVisible(true);
  };

  const [form] = Form.useForm();

  const rules = {
    name: [{ required: true, message: t("common.required"), type: "error" }],
    content: [{ required: true, message: t("common.required"), type: "error" }],
    desc: [],
    icon: [],
  };

  const onFormConfirm = () => {
    form.validate().then((success) => {
      if (success === true) {
        const prompt = form.getFieldsValue(true);
        save({ ...(editingPrompt || {}), ...prompt });
        setDrawerVisible(false);
      } else {
        console.log(t("common.form_validation_failed"));
      }
    });
  };

  return (
    <div>
      <Popup
        placement="top-left"
        trigger={isMobile ? "click" : "hover"}
        showArrow
        content={
          <div className="flex flex-wrap items-center p-2">
            {all.map((prompt) => (
              <Popup
                overlayClassName="max-w-[320px]"
                key={prompt.id}
                placement="top-left"
                showArrow
                content={
                  <div className="flex flex-col">
                    <span className="mb-1">{prompt.name}</span>
                    <span className="mb-2 text-xs text-gray-500">
                      {prompt.desc || prompt.content}
                    </span>
                    <div className="flex items-center justify-end">
                      <div className="flex-1"></div>
                      <CopyToClipboard
                        text={prompt.id}
                        onCopy={() => message.success(t("common.copied"))}
                      >
                        <Button
                          size="small"
                          icon={<i className="mr-1 i-mingcute-copy-2-line" />}
                          variant="text"
                        >
                          {t("common.copy_id")}
                        </Button>
                      </CopyToClipboard>
                      <Button
                        size="small"
                        icon={<i className="mr-1 i-mingcute-copy-2-line" />}
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          save(
                            {
                              ...prompt,
                              name: prompt.name + " (copy)",
                              id: void 0,
                              isPreset: false,
                            },
                            true
                          );
                        }}
                      >
                        {t("common.copy")}
                      </Button>
                      {!prompt?.isPreset && (
                        <>
                          <Button
                            size="small"
                            icon={<i className="mr-1 i-mingcute-edit-line" />}
                            variant="text"
                            className="ml-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(prompt);
                            }}
                          >
                            {t("common.edit")}
                          </Button>
                          <Button
                            size="small"
                            icon={<i className="mr-1 i-mingcute-delete-line" />}
                            variant="text"
                            theme="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(prompt);
                            }}
                          >
                            {t("common.delete")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                }
              >
                <img
                  onClick={() => setActive(prompt)}
                  src={prompt.icon}
                  alt={prompt.name}
                  style={{ filter: 'brightness(0)' }}
                  className={
                    "w-6 h-6 mr-2 rounded-full overflow-hidden cursor-pointer transform transition-transform select-none " +
                    (prompt.id === active.id ? "scale-[1.2]" : "scale-100")
                  }
                />
              </Popup>
            ))}
            <Tooltip content={t("system_prompt.add_new")}>
              <div
                className="flex items-center justify-center w-6 h-6 p-1 font-semibold border-2 rounded-full cursor-pointer text-primary border-primary"
                onClick={() => onEdit()}
              >
                <i className="i-mingcute-add-fill" />
              </div>
            </Tooltip>
          </div>
        }
      >
        <div className="flex items-center justify-center w-6 h-6 mr-1">
          <img
            id={GUIDE_STEP.INPUT_SELECT_SYSTEM_PROMPT}
            src={active.icon}
            alt={active.name}
            className="w-full h-full rounded-full cursor-pointer select-none dark:filter dark:invert dark:brightness-0 dark:contrast-100"
          />
        </div>
      </Popup>

      <Drawer
        visible={drawerVisible}
        size={isMobile ? "100%" : "large"}
        onClose={() => setDrawerVisible(false)}
        onConfirm={onFormConfirm}
        header={t(
          editingPrompt ? "system_prompt.edit" : "system_prompt.add_new"
        )}
      >
        <Form
          rules={rules}
          form={form}
          labelAlign="right"
          layout="vertical"
          preventSubmitDefault
          resetType="empty"
          showErrorMessage
          onValuesChange={(values, allValues) => {
            if (values.icon) {
              setEditingIcon(values.icon);
            }
            if (values.name) {
              let icon = "";
              if (!allValues.icon) {
                icon = `https://avatar.vercel.sh/${
                  Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15)
                }.svg?text=${values.name}`;
              } else if (
                allValues.icon.startsWith("https://avatar.vercel.sh")
              ) {
                icon = allValues.icon.replace(
                  /(\?text=)([^&]+)/,
                  `$1${values.name}`
                );
              } else {
                return;
              }
              setEditingIcon(icon);
              form.setFieldsValue({ icon });
            }
          }}
        >
          <FormItem label={t("common.name")} name="name">
            <Input />
          </FormItem>
          <FormItem
            help={t("system_prompt.avatar_help")}
            label={t("common.icon")}
            name="icon"
          >
            <Input
              suffixIcon={
                editingIcon && (
                  <img
                    alt="icon"
                    src={editingIcon}
                    className="w-6 h-6 transform translate-x-1 rounded-full"
                  />
                )
              }
            />
          </FormItem>
          <FormItem label={t("common.description")} name="desc">
            <Textarea rows={3} />
          </FormItem>
          <FormItem label={t("common.content")} name="content">
            <Textarea rows={5} />
          </FormItem>
        </Form>
      </Drawer>
    </div>
  );
}

export default forwardRef(SystemPromptSelector);
