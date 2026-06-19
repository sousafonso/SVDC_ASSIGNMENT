# Energia e Emissões de CO₂: O Caminho para a Descarbonização em Portugal e na União Europeia

Trabalho prático desenvolvido para a unidade curricular de **Sistemas de Visualização de Dados e Conhecimento (SVDC)**.

## 👥 Autores
*   **Afonso Sousa** (PG61506)
*   **Vicente Castro** (PG60395)

---

## 📝 Descrição Geral
Este projeto analisa a evolução do consumo energético e das emissões de dióxido de carbono (CO₂) em Portugal e na União Europeia. O objetivo principal é responder a três perguntas centrais:
1.  **Como é composto o sistema energético português (mix energético)?**
2.  **Como evoluíram a quota de energias renováveis e as emissões de CO₂ per capita ao longo do tempo?**
3.  **Onde se posiciona Portugal em comparação com os restantes parceiros europeus?**

Para tal, foi desenvolvida uma narrativa visual integrada (**Datastory**) que se apoia em **três dashboards complementares** construídos com recurso a **D3.js** (Dashboard 1) e **Tableau** (Dashboards 2 e 3).

---

## 📁 Estrutura do Repositório

*   [SVDC.pdf](file:/SVDC_ASSIGNMENT/SVDC.pdf) — O documento final da **Datastory** que descreve e analisa os dados obtidos, contextualizando as políticas climáticas com as visualizações.
*   [svdc.twb](file:/SVDC_ASSIGNMENT/svdc.twb) — Ficheiro do Tableau contendo os **Dashboards 2 e 3**.
*   [index.html](file:/SVDC_ASSIGNMENT/index.html) — Página HTML do **Dashboard 1** (Mix Energético interativo).
*   [main.js](file:/SVDC_ASSIGNMENT/main.js) — Lógica de renderização do **Dashboard 1** em D3.js.
*   [owid-energy-data.csv](file:/SVDC_ASSIGNMENT/owid-energy-data.csv) — Dataset global de energia da *Our World in Data*.
*   [owid-co2-data.csv](file:/SVDC_ASSIGNMENT/owid-co2-data.csv) — Dataset global de emissões de CO₂ da *Our World in Data*.
*   [pibs/](file:/SVDC_ASSIGNMENT/pibs) — Diretório contendo dados complementares sobre o PIB per capita PPP (World Bank), utilizados no gráfico de dispersão.

---

## 📊 Detalhe dos Dashboards

### Dashboard 1: O Mix Energético (D3.js)
*   **Ficheiros:** [index.html](file:/SVDC_ASSIGNMENT/index.html) e [main.js](file:/SVDC_ASSIGNMENT/main.js)
*   **Tipo de Gráfico:** Gráfico de barras empilhadas (*Stacked Bar Chart*).
*   **Descrição:** Mostra a decomposição percentual das fontes de energia primária (Renováveis, Nuclear e Fósseis) para o ano selecionado.
*   **Interatividade:**
    *   *Slider* temporal para escolher o ano de análise.
    *   Filtro e destaque automático para quatro países de referência: **Portugal**, **Alemanha**, **França** e **Espanha**.
    *   *Tooltips* interativos com os valores exatos de percentagem para cada fonte.

### Dashboard 2: Dispersão Internacional (Tableau)
*   **Ficheiro:** [svdc.twb](file:/SVDC_ASSIGNMENT/svdc.twb) (Folha `D2 - Scatter`)
*   **Tipo de Gráfico:** Gráfico de dispersão por bolhas (*Scatter Plot*).
*   **Descrição:** Posiciona os países com base na relação entre a Quota de Renováveis no Mix Energético (Eixo X) e as Emissões de CO₂ per Capita (Eixo Y).
*   **Elementos Visuais:**
    *   **Tamanho das bolhas:** Representa o PIB per capita (*GDP per capita*), permitindo perceber o nível económico de cada país.
    *   **Cor das bolhas:** Diferencia os vários países.
    *   **Destaque:** Anotação visual específica para **Portugal**, facilitando o acompanhamento da sua evolução relativa face à União Europeia.
    *   *Controlador de tempo* para analisar a reorganização global da nuvem de países ao longo das décadas.

### Dashboard 3: Trajetória Temporal de Portugal (Tableau)
*   **Ficheiro:** [svdc.twb](file:/SVDC_ASSIGNMENT/svdc.twb) (Folha `D3 - Portugal`)
*   **Tipo de Gráfico:** Série temporal de eixo duplo (*Dual Axis Line Chart*).
*   **Descrição:** Foca-se no caso de estudo nacional, mostrando a evolução simultânea e o cruzamento das seguintes métricas ao longo do tempo:
    1.  Quota de energia renovável no mix (%)
    2.  Emissões de CO₂ per capita
*   **Marcos Históricos Anotados:**
    *   **1997:** Protocolo de Quioto.
    *   **2005:** Início do EU ETS (Sistema de Comércio de Licenças de Emissão da União Europeia).
    *   **2010:** Boom da energia eólica em Portugal.

---

## 🛠️ Tecnologias Utilizadas
*   **Frontend:** HTML5, CSS3, JavaScript (ES6)
*   **Biblioteca de Visualização Web:** [D3.js v7](https://d3js.org/)
*   **Business Intelligence / Visualização:** Tableau Desktop (versão 2026.1+)
*   **Fontes de Dados:**
    *   [Our World in Data (Energy)](https://ourworldindata.org/energy)
    *   [Our World in Data (CO2)](https://ourworldindata.org/co2-and-greenhouse-gas-emissions)
    *   [World Bank (GDP per capita, PPP)](https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD)

---
