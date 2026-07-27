export interface SiteSettings {
  brand_name: string;
  brand_name_color: string;
  tagline: string;
  tagline_color: string;
  footer_text: string;
  footer_color: string;
  page_bg_type: "color" | "image";
  page_bg_value: string;
  card_bg_type: "color" | "image";
  card_bg_value: string;
  btn_bg_type: "color" | "image";
  btn_bg_value: string;
  btn_text_color: string;
  logo_url: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export type BgType = "color" | "image";
