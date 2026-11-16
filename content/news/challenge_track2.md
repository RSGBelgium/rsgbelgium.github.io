---
layout: single
title: "BioHackathon 2025 Challenge Track 2"

date: "2025-09-25"
categories: event biohackathon track2

category: 'biohackathon2025'

---
## **Prediction of Embryonic Stage from Single Cell RNASeq Data**



## **1\. Abstract**

Accurately predicting the embryonic stage from molecular data is a key step toward understanding developmental dynamics. In this challenge, we ask you to use machine learning approaches to predict the embryonic stage of samples based on transcriptomic data of developing heart. You must use **classical machine learning techniques only** (no deep learning) to predict embryonic stages based solely on RNA expression profiles.

## **2\. Background and Motivation**

Embryogenesis is a tightly regulated process in which gene expression and cellular states change in a time-dependent manner. Correctly identifying the embryonic period of samples is critical for developmental biology, regenerative medicine, and disease modeling. The heart is the first organ to acquire functionality during mammalian embryogenesis (Zaffran & Frasch, 2002), and relies on a tightly regulated and complex process dependent on the coordinated contributions of multiple cell lineages (Bruneau, 2013; Olson, 2006). The underlying gene regulatory mechanisms in the human embryonic heart remain poorly understood. Accurately predicting the cell embryonic stage can be the first step to understand the interaction between genes and underlying regulation mechanisms during embryonic development. High-quality single-cell RNA-seq datasets for embryonic heart tissue are scarce and imbalanced across developmental stages, complicating prediction. In this challenge, you will help establish the first benchmark framework for predicting embryonic stage from single-cell transcriptomes using machine learning that can handle class imbalance and data scarcity.

## **3\. Challenge Objectives**

* Predict embryonic stage from single-cell transcriptomic data.
* Reduce high-dimensional data to informative features for machine learning.
* Correct batch effects from the dataset
* Compare different computational strategies (classical ML techniques, existing pre-trained models…).
* Evaluate models using:
  * Macro Average F1-score
  * Mean Squared Error (MSE)
  * Coefficient of Determination (R²)
* Deliver a reproducible benchmark resource for the community.

## **4\. Data Description**

* **Data source:** Dataset merged from two single-cell RNA-seq datasets of developing heart tissue (Cui et al., 2019; Knight-Schrijver et al., 2022), annotated by embryonic stage post-fertilization and dataset of origin.
* **Modalities:** Single-cell RNA-seq
* **Preprocessing:** No preprocessing, raw counts are provided
* **Format:** Annotated count matrix in .h5ad format
* **Access:** [Data repository link](https://drive.google.com/file/d/1RVJqY0sKrZoYpn5FRJALSKbsXVUMa_eF/view?usp=sharing)
* **Ethical note:** Data is anonymized and publicly available.

## **5\. Baseline and Resources**

We will provide:

* A [Jupyter notebook](https://drive.google.com/file/d/1uvuQshd49CQDgE7ru72Gkk9kg2LlB7xv/view?usp=drivesdk) with tutorials for data loading and preprocessing. 
* A simple baseline model (linear classifier).
* Method to save model as pkl file

You may use any publicly available packages but must document dependencies.

## **6\. Evaluation Criteria**

* **Primary metric:**
  * Mean Squared Error (**MSE**)
  * Coefficient of determination (**R2**) score

  * **Macro Average F1-score**
* **Secondary criteria:**
  * Feature preprocessing quality
  * Reproducibility (functional notebooks)
  * Code clarity and documentation

Final ranking will prioritize primary metrics but the secondary criteria will also be considered.

## **7\. Participation Guidelines**

Your submission must include:

1. Source code and environment specifications (can also be through Github, optional)
2. A pre-trained model in .pkl format.
3. A runnable script that:
   * Accepts input data
   * Loads the pre-trained model
   * Outputs predictions as a .csv file

External data is permitted if openly available and clearly declared.

During the pitch session, you are asked to provide a 10 mins pitch presentation (followed by 4-mins Q\&A) presenting the way you tackled the challenge, from preprocessing, model choice, model performance on both train and validation dataset, whether any hyper-parameter tuning was done or not, and how did you met the evaluation criteria mentioned earlier.

## **8\. Timeline**

* **Submission deadline:** September 26, 16:45 (local time).
* **Submission format:** Single .zip file uploaded to the challenge portal.
* **Late submissions will not be accepted.**
* [**Submission Link**](https://docs.google.com/forms/d/e/1FAIpQLSeFLE-JosNs-2OAGXpxiN9P2o3jXC_rdK5645xB7XPWuXhZqA/viewform?usp=dialog)

## **9\. References**

Zaffran, S., & Frasch, M. (2002). Early signals in cardiac development. Circulation Research, 91(6), 457–469. [https://doi.org/10.1161/01.res.0000034152.74523.a8](https://doi.org/10.1161/01.res.0000034152.74523.a8)

Olson, E. N. (2006). Gene regulatory networks in the evolution and development of the heart. Science, 313(5795), 1922-1927.

Bruneau, B. G. (2013). Signaling and transcriptional networks in heart development and regeneration. Cold Spring Harbor perspectives in biology, 5(3), a008292.

Knight-Schrijver, V. R., Davaapil, H., Bayraktar, S., Ross, A. D. B., Kanemaru, K., Cranley, J., Dabrowska, M., Patel, M., Polanski, K., He, X., Vallier, L., Teichmann, S., Gambardella, L., & Sinha, S. (2022). A single-cell comparison of adult and fetal human epicardium defines the age-associated changes in epicardial activity. Nature Cardiovascular Research, 1(12), 1215–1229. [https://doi.org/10.1038/s44161-022-00183-w](https://doi.org/10.1038/s44161-022-00183-w)

Cui, Y., Zheng, Y., Liu, X., Yan, L., Fan, X., Yong, J., Hu, Y., Dong, J., Li, Q., Wu, X., Gao, S., Li, J., Wen, L., Qiao, J., & Tang, F. (2019). Single-Cell transcriptome analysis maps the developmental track of the human heart. Cell Reports, 26(7), 1934-1950.e5. [https://doi.org/10.1016/j.celrep.2019.01.079](https://doi.org/10.1016/j.celrep.2019.01.079)















