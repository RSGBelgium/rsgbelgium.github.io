---
layout: single
title: "BioHackathon 2025 Challenge Track 1"
date: "2025-09-25"
categories: event biohackathon track1
category: 'biohackathon2025'
---

## **Decoding Cell-Cell Communication Along the Gut-Brain Axis Using Single-Cell Transcriptomics**

## **1\. Abstract**

Your task is to explore single-cell RNA-seq datasets from mouse small intestine epithelium and enteric nervous system to uncover insights into **cell-to-cell communication** and interactions along the gut-brain axis. You must apply **classical bioinformatics and statistical approaches** to analyze, integrate, and interpret these datasets. The novelty of your submission will be judged on the robustness of your methodology and the clarity of your scientific communication.

## **2\. Background and Motivation**

The gut-brain axis is a bidirectional communication network linking the intestinal epithelium and the enteric nervous system (Zhao et al., 2025). It plays a central role in digestion, immunity, and neurological function. Single-cell RNA-seq provides a powerful lens to dissect the cellular interactions underlying this crosstalk. This challenge invites you to apply classical bioinformatics approaches to extract meaningful biological insights and present them in a clear, interpretable manner.

## **3\. Challenge Objectives**

* Perform exploratory analysis of two single-cell RNA-seq datasets (epithelial cells and enteric nervous system).
* Identify cell-cell communication signals relevant to the gut-brain axis.
* Apply robust statistical and bioinformatics approaches to validate findings.
* Communicate results effectively through figures, text, and reproducible workflows.

## **4\. Data Description**

* **Source:** Mouse small intestine epithelium (Haber et al., 2017\) and enteric nervous system (Drokhlyansky et al., 2020\) single-cell RNA-seq datasets.
* **Modality:** Single-cell RNA-seq (gene expression).
* **Format:** Annotated count matrices in .mtx and .txt.gz format.
* **Preprocessing:** No QC filtering is performed; raw expression and metadata provided (Data provided as in online by authors).
* **Access:** Data access portals are available online for [mouse small intestine epithelium](https://singlecell.broadinstitute.org/single_cell/study/SCP44/small-intestinal-epithelium?cluster=Atlas%20of%20epithelial%20cells%20\(Figure%201\)&spatialGroups=--&annotation=Mouse--group--study&subsample=all#study-summary) (Haber et al., 2017\) and [enteric nervous system](https://singlecell.broadinstitute.org/single_cell/study/SCP1038/the-human-and-mouse-enteric-nervous-system-at-single-cell-resolution?label=PEMN_1&cluster=hli.tsne2.txt&spatialGroups=--&annotation=LABEL--group--cluster&subsample=100000#study-summary) (Drokhlyansky et al., 2020\) single-cell RNA-seq datasets respectively (require account creation for access).
* **Ethics:** Data is anonymized and publicly available.

## **5\. Suggested Approaches**

You are more than welcome to come up with your own questions. To get you started, here are some initial research questions for your inspiration:

* Which ligand-receptor interaction networks, predicted by scRNAseq data, bridge epithelial and enteric nervous system cell types? Do these networks align with known neuro-immune or neuro-epithelial communication axes relevant to gut-brain signaling??
* Are there unique gene expression programs in neurons, epithelial cells or glial cells at the interface between the enteric nervous system and gut lining indicative of region-specific communication?
* Do specific enteric neuron classes preferentially interact with certain epithelial subtypes, and do these interactions underlie specialized gut-brain signals such as sensory input or secretion regulation?

Here are also some techniques you can try to investigate these questions too:

* Cell type identification and annotation.
* Differential expression analysis.
* Ligand-receptor interaction analysis (e.g., CellChat, NicheNet, or equivalent classical frameworks).
* Visualization of communication networks.
* Integration of datasets across tissues.

You are free to choose your methodology but you must justify your choices.

## **6\. Evaluation Criteria**

* **Insights**
  * Biological relevance and novelty of findings.
  * Clear link to gut-brain axis communication.
* **Methodology**
  * Sound statistical and bioinformatics approaches.
  * Appropriate handling of noise, sparsity, and bias.
* **Communication**
  * Clarity of figures and text.
  * Concise and interpretable narrative.
  * Reproducibility (notebooks, scripts, or containers).

## **7\. Participation Guidelines**

Your submission must include:

1. Annotated source code (notebooks or scripts).
2. Environment specifications (requirements file or container).

External data is permitted if openly available and clearly declared.

During the pitch session, you are asked to provide a 10 mins pitch presentation (followed by 4-mins Q\&A) presenting the way you tackled the challenge, and summarizing insights, methods, and key figures from your work .

[Submission link](https://forms.gle/S6aZ9kWhoaoCpdck8)

## **8\. Timeline**

* **Submission deadline:** September 26, 16:45 (local time).
* **Submission format:** Single .zip file uploaded to the challenge portal.
* **Late submissions will not be accepted.**

## **9\. References**

Zhao, D., Shiga, R. T., Song, Z., Shu, R., Loo, L., & Wong, A. C. N. (2025). Microbiome drives age-dependent shifts in brain transcriptomic programs at the single-cell level in Drosophila. Npj Biofilms and Microbiomes, 11(1). [https://doi.org/10.1038/s41522-025-00781-z](https://doi.org/10.1038/s41522-025-00781-z)

Haber, A. L., Biton, M., Rogel, N., Herbst, R. H., Shekhar, K., Smillie, C., Burgin, G., Delorey, T. M., Howitt, M. R., Katz, Y., Tirosh, I., Beyaz, S., Dionne, D., Zhang, M., Raychowdhury, R., Garrett, W. S., Rozenblatt-Rosen, O., Shi, H. N., Yilmaz, O., . . . Regev, A. (2017). A single-cell survey of the small intestinal epithelium. *Nature*, *551*(7680), 333–339. [https://doi.org/10.1038/nature24489](https://doi.org/10.1038/nature24489)

Drokhlyansky, E., Smillie, C. S., Van Wittenberghe, N., Ericsson, M., Griffin, G. K., Eraslan, G., Dionne, D., Cuoco, M. S., Goder-Reiser, M. N., Sharova, T., Kuksenko, O., Aguirre, A. J., Boland, G. M., Graham, D., Rozenblatt-Rosen, O., Xavier, R. J., & Regev, A. (2020). The human and mouse enteric nervous system at Single-Cell resolution. Cell, 182(6), 1606-1622.e23. [https://doi.org/10.1016/j.cell.2020.08.003](https://doi.org/10.1016/j.cell.2020.08.003)
