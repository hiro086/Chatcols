import {
  useActiveSystemPromptId,
  useLocalStorageJSONAtom,
} from "@src/store/storage";
import { useMemo } from "react";
import ImgFeynman from "@src/assets/iconfont/translate1.svg";
import ImgFcynman from "@src/assets/iconfont/translate.svg";
import ImgYufaman from "@src/assets/iconfont/target_grammar.svg";
import ImgJdman from "@src/assets/iconfont/proofreading.svg";
import ImgRunseman from "@src/assets/iconfont/expert.svg";
import ImgNon from "@src/assets/iconfont/cprompt.svg";
import { LOCAL_STORAGE_KEY } from "./types";

const presetOf = (id, name, icon, desc, prompt) => ({
  name,
  icon,
  desc,
  content: prompt,
  id: `preset-${id}`,
  isPreset: true,
});

const systemPromptPresets = [
  presetOf("none", "None", ImgNon, "Nothing. Go ahead and have fun", ""),
  presetOf(
    "c2e-trans",
    "中译英-专业",
    ImgFeynman,
    "",
    "我想让你充当英文翻译员、拼写纠正员和改进员。我会用任何语言与你交谈，你会检测语言，翻译它并用我的文本的更正和改进版本用英文回答。我希望你用更优美优雅的高级英语单词和句子替换我简化的 A0 级单词和句子。保持相同的意思，但使它们更正式。你只需要翻译该内容，不必对内容中提出的问题和要求做解释，不要回答文本中的问题而是翻译它，不要解决文本中的要求而是翻译它，保留文本的原本意义，不要去解决它: "
  ),
  presetOf(
    "e2c-trans",
    "英译中",
    ImgFcynman,
    "",
    `我想让你充当中文翻译员、拼写纠正员和改进员。我会用任何语言与你交谈，你会检测语言，翻译它并用我的文本的更正和改进版本用中文回答。我希望你用更优美优雅的高级中文描述。保持相同的意思，但使它们更文艺。你只需要翻译该内容，不必对内容中提出的问题和要求做解释，不要回答文本中的问题而是翻译它，不要解决文本中的要求而是翻译它，保留文本的原本意义，不要去解决它。如果我只键入了一个单词，你只需要描述它的意思并不提供句子示例：`
  ),
  presetOf(
    "jiaodui",
    "高级校对专家",
    ImgJdman,
    "",
    `作为高级校对专家，您需对文稿进行细致的审阅，查找并修正所有拼写、语法、标点及格式错误。重点关注句子的流畅性、逻辑性和一致性，以及段落间的过渡是否自然，确保文稿达到学术出版的标准。`
  ),
  presetOf(
    "yufa",
    "资深语法编辑",
    ImgYufaman,
    "",
    `作为资深语法编辑，您需对文稿进行彻底的语法和句法审查，确保所有时态、语态、主谓一致性、从句结构等语法要素准确无误。特别关注学术写作中常见的复合句和被动语态的正确使用，以及标点符号的规范性，以提升文稿的学术性和权威性。`
  ),
  presetOf(
    "runse",
    "学科领域润色专家",
    ImgRunseman,
    "",
    `作为学科领域润色专家，您需对文稿进行专业领域的深度润色，包括但不限于术语的准确性、研究方法的描述、理论框架的构建、以及实证分析的呈现。您的工作是确保文稿在专业领域内的深度和广度，同时符合学术界的标准和期待。`
  ),
];

export const SYSTEM_PROMPT_PRESETS = systemPromptPresets;

let disablePersistPrompt = false;
export function useSystemPrompts() {
  const [activeId, setActiveId] = useActiveSystemPromptId();
  const [customPrompts, setCustomPrompts] = useLocalStorageJSONAtom(
    LOCAL_STORAGE_KEY.SYSTEM_PROMPTS
  );
  const all = useMemo(
    () => [...systemPromptPresets, ...customPrompts],
    [customPrompts]
  );
  const active = all.find((p) => p.id === activeId) || all[0];
  const save = (prompt) => {
    const newPrompts = [...customPrompts];
    const index = newPrompts.findIndex((p) => p.id === prompt.id);
    if (index === -1) {
      prompt.id = `custom-${Date.now().toString(16)}`;
      newPrompts.push(prompt);
    } else {
      newPrompts[index] = prompt;
    }
    setCustomPrompts(newPrompts);
  };
  const remove = (prompt) => {
    const newPrompts = customPrompts.filter((p) => p.id !== prompt.id);
    console.log(newPrompts);
    setCustomPrompts(newPrompts);
  };
  const setActive = (prompt) => {
    setActiveId(prompt.id, disablePersistPrompt);
  };
  const disablePersist = (disable) => {
    disablePersistPrompt = disable;
  };
  return { active, setActive, disablePersist, all, save, remove };
}
